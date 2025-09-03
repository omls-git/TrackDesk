module.exports = (sequelize, DataTypes) => {
  const Cases = sequelize.define("masterCases", {
    project_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'clients',
        key: 'id'
      }
    },
    casesOpen: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    caseNumber: {
      type: DataTypes.STRING,
      allowNull: true
    },
    inital_fup: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ird_frd: {
      type: DataTypes.DATE,
      allowNull: true
    },
    assignedDateDe: {
      type: DataTypes.DATE,
      allowNull: true
    },
    completedDateDE: {
      type: DataTypes.DATE,
      allowNull: true
    },
    deStartedAt:{
      type: DataTypes.DATE,
      allowNull: true
    },
    de: {
      type: DataTypes.STRING,
      allowNull: true
    },
    deStatus:{
      type: DataTypes.STRING,
      allowNull: true
    },
    assignedDateQr: {
      type: DataTypes.DATE,
      allowNull: true
    },
    qrStartedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    completedDateQR: {
      type: DataTypes.DATE,
      allowNull: true
    },
    qr: {
      type: DataTypes.STRING,
      allowNull: true
    },
    qrStatus: {
      type: DataTypes.STRING,
      allowNull: true
    },
    assignedDateMr: {
      type: DataTypes.DATE,
      allowNull: true
    },
    mrStartedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    completedDateMr: {
      type: DataTypes.DATE,
      allowNull: true
    },
    mr: {
      type: DataTypes.STRING,
      allowNull: true
    },
    mrStatus: {
      type: DataTypes.STRING,
      allowNull: true
    },
    caseStatus: {
      type: DataTypes.STRING,
      allowNull: true
    },
    reportability: {
      type: DataTypes.STRING,
      allowNull: true
    },
    seriousness: {
      type: DataTypes.STRING,
      allowNull: true
    },
    live_backlog: {
      type: DataTypes.STRING,
      allowNull: true
    },
    comments: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    comment2: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    isCaseOpen: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true
    },
    DestinationForReporting: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    ReportingComment: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    SDEAObligation: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    Source: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    ReportType: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    XML_Non_XML: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ORD:{
      type: DataTypes.DATE,
      allowNull: true
    },
    Country:{
      type: DataTypes.STRING,
      allowNull: true
    },
    Partner:{
      type: DataTypes.STRING,
      allowNull: true
    },
    triageAssignedTo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    triageStatus: {
      type: DataTypes.STRING,
      allowNull: true
    },
    triageAssignedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    triageStartedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    triageCompletedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    createdOn: {
      type: DataTypes.DATE,
      defaultValue: null,
      allowNull: true
    },
    createdBy: {
      type: DataTypes.STRING,
      defaultValue: null,
      allowNull: true
    },
    modifiedBy: {
      type: DataTypes.STRING,
      defaultValue: null,
      allowNull: true
    },
    modifiedOn: {
      type: DataTypes.DATE,
      defaultValue: null,
      allowNull: true
    },
    authorityNumber: {
      type: DataTypes.STRING,
      allowNull: true
    },
    safetyReportId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    validity: {
      type: DataTypes.STRING,
      allowNull: true
    },
    argusId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    literatureCitation: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    linkedDeactivations: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    bookInDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    bookInReceivedDate: {
      type: DataTypes.STRING,
      allowNull: true
    },
    manualBookIn: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    bookInAssignedDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    bookInStartedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    bookInCompletedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    bookInWorkStatus: {
      type: DataTypes.STRING,
      allowNull: true
    },
    bookInType: {
      type: DataTypes.STRING,
      allowNull: true
    },
    OM_ID: {
      type: DataTypes.STRING,
      allowNull: true
    },
    case_is_from: {
      type: DataTypes.STRING,
      allowNull: true
    },
    subjectLine: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    title_of_the_article: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    bookInAssignedTo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    bookInReceiptDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    bookInDueDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    bookInCompletedDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    bookInStatus: {
      type: DataTypes.STRING,
      allowNull: true
    },
    no_of_cases_created: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    TAT_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    allocation_Received_on: {
      type: DataTypes.DATE,
      allowNull: true
    },
    COI: {
      type: DataTypes.STRING,
      allowNull: true
    },
    suspect_drug: {
      type: DataTypes.STRING,
      allowNull: true
    },
    event: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    LOE: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    PQC: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    openWorkflow: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    }
  },{
    timestamps: true
  });

  Cases.associate = (models) => {
    Cases.belongsTo(models.Clients, { foreignKey: 'project_id', targetKey: 'id' });
  };
  return Cases;
};