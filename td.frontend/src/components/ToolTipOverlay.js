import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

function ToolTipOverlay({ initials, account}) {
  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      <b>{account ? account.name : ''}</b> <br/>
      <b>{account ? account.username : ''}</b>
    </Tooltip>
  );

  return (
    <OverlayTrigger
      placement="bottom"
      delay={{ show: 250, hide: 400 }}
      overlay={renderTooltip}
    >
      <Button variant="success" style={{fontWeight:'bold'}}>{initials}</Button>
    </OverlayTrigger>
  );
}

export default ToolTipOverlay;