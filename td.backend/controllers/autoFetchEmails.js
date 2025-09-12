import { CronJob } from "cron";
import dB from "../models/index.js";
import axios from "axios";

const Cases = dB.cases;

async function getAccessToken() {
  const url = `https://login.microsoftonline.com/${process.env.MS_TENANT_ID}/oauth2/v2.0/token`;
  const params = new URLSearchParams({
    client_id: process.env.MS_CLIENT_ID,
    client_secret: process.env.MS_CLIENT_SECRET,
    scope: "https://graph.microsoft.com/.default",
    grant_type: "client_credentials",
  });

  const res = await axios.post(url, params.toString(), {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  return res.data.access_token;
}

async function fetchEmails() {
  console.log(new Date().toISOString(), "-> Starting fetchEmails");

  try {
    const token = await getAccessToken();
    // request top 50 per page; adjust as needed
    let url = `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(
      process.env.MS_USER_EMAIL
    )}/mailFolders/Inbox/messages?$top=100&$select=id,subject,receivedDateTime,from,isRead,bodyPreview,body,&$orderby=receivedDateTime desc`;

    let newCount = 0;

    while (url) {
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const messages = res.data.value || [];

      for (const m of messages) {
        // Use findOrCreate to avoid duplicates
        const [record, created] = await Cases.findOrCreate({
          where: { outlookId: m.id },
          defaults: {
            outlookId: m.id,
            subject: m.subject || "",
            receivedDateTime: m.receivedDateTime ? new Date(m.receivedDateTime) : null,
            caseStatus: "BookIn",
            project_id: clientId,
            bookInType: 'non-xml'
          },
        });

        if (created) newCount++;
      }

      // page forward if Graph provided a nextLink
      url = res.data["@odata.nextLink"] || null;
    }

    console.log(`✅ fetchEmails done — ${newCount} new messages stored`);
  } catch (err) {
    console.error("❌ fetchEmails error:", err.response?.data || err.message);
  }
}

export function startScheduler() {
  const job = new CronJob("0 0 * * * *", fetchEmails, null, true, "Asia/Kolkata");
  job.start();
  console.log("⏰ Scheduler started: will run at the top of every hour (Asia/Kolkata)");
}