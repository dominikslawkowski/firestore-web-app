import { format } from "date-fns";

const Donate = ({ donate, index }) => {
  const createdAt = new Date();
  createdAt.setSeconds(donate.createdAt.seconds);

  return (
    <div key={donate.id || `donate-${index}`} className="donate">
      <span className="name">{donate.name}</span>
      <span className="amount">{donate.amount} $</span>
      <span className="createdAt">{format(createdAt, "dd MMM yyyy")}</span>
    </div>
  );
};

export default Donate;
