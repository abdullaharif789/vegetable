import * as React from "react";
import { useDataProvider, Loading } from "react-admin";
import ReactToPrint from "react-to-print";
import Button from "@material-ui/core/Button";
import Print from "@material-ui/icons/Print";
import InvoiceShow from "./InvoiceShow";
import { useParams } from "react-router-dom";
class PurchaseInvoiceChild extends React.PureComponent {
  render() {
    return (
      <div>
        <ReactToPrint
          trigger={() => {
            return (
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: 10,
                  marginBottom: 10,
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<Print fontSize="inherit" />}
                >
                  Print
                </Button>
              </div>
            );
          }}
          content={() => this.componentRef}
        />
        <InvoiceShow ref={(el) => (this.componentRef = el)} {...this.props} />
      </div>
    );
  }
}
const PurchaseInvoice = (props) => {
  const purchase_order_id = useParams().id;
  const dataProvider = useDataProvider();
  const [data, setData] = React.useState();
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    dataProvider
      .getOne("purchase_orders", { id: purchase_order_id })
      .then(({ data }) => {
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  }, [props]);
  if (loading)
    return (
      <Loading loadingPrimary="" loadingSecondary="Generating Invoice.." />
    );
  else return <PurchaseInvoiceChild record={data} />;
};
// eslint-disable-next-line import/no-anonymous-default-export
export default PurchaseInvoice;
