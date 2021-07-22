import React, {
  useState,
  useEffect,
  useCallback,
  FC,
  CSSProperties,
} from "react";
import { useVersion, useDataProvider } from "react-admin";
import { useMediaQuery, Theme } from "@material-ui/core";
import { subDays } from "date-fns";

import MonthlyRevenue from "./MonthlyRevenue";
import { app } from "../contants";

import NewOrders from "./NewOrders";
import NewCustomers from "./NewCustomers";
import PendingOrders from "./PendingOrders";
//   import PendingReviews from "./PendingReviews";

import OrderChart from "./OrderChart";

//   import { Customer, Order, Review } from "../types";

//   interface OrderStats {
//     revenue: number;
//     nbNewOrders: number;
//     pendingOrders: Order[];
//   }

//   interface CustomerData {
//     [key: string]: Customer;
//   }

//   interface State {
//     nbNewOrders?: number;
//     nbPendingReviews?: number;
//     pendingOrders?: Order[];
//     pendingOrdersCustomers?: CustomerData;
//     pendingReviews?: Review[];
//     pendingReviewsCustomers?: CustomerData;
//     recentOrders?: Order[];
//     revenue?: string;
//   }

const styles = {
  flex: { display: "flex" },
  flexColumn: { display: "flex", flexDirection: "column" },
  leftCol: { flex: 1, marginRight: "0.5em" },
  rightCol: { flex: 1, marginLeft: "0.5em" },
  singleCol: { marginTop: "1em", marginBottom: "1em" },
  topZeroMargin: { marginTop: "0em", marginBottom: "1em" },
};

const Spacer = () => <span style={{ width: "1em" }} />;
const VerticalSpacer = () => <span style={{ height: "1em" }} />;

const Dashboard = () => {
  const [state, setState] = useState({
    revenue: app.currencySymbol + "0.00",
    recentOrders: [],
    newOrders: "0",
  });
  const version = useVersion();
  const dataProvider = useDataProvider();
  const isXSmall = useMediaQuery((theme) => theme.breakpoints.down("xs"));
  const isSmall = useMediaQuery((theme) => theme.breakpoints.down("md"));

  const fetchOrders = useCallback(async () => {
    const aMonthAgo = subDays(new Date(), 30);
    const { data: recentOrders } = await dataProvider.getList("orders", {
      filter: { date_gte: aMonthAgo.toISOString() },
      sort: { field: "created_at", order: "DESC" },
      pagination: { page: 1, perPage: 50 },
    });
    const aggregations = recentOrders
      .filter(
        (order) => order.status == "Completed" || order.status == "Initiated"
      )
      .reduce(
        (stats, order) => {
          if (order.status == "Completed") {
            stats.revenue += parseFloat(order.total);
          }
          if (order.status === "Initiated") {
            stats.newOrders++;
            stats.pendingOrders.push(order);
          }
          return stats;
        },
        {
          revenue: 0,
          newOrders: 0,
          pendingOrders: [],
        }
      );

    setState((state) => ({
      ...state,
      recentOrders,
      newOrders: aggregations.newOrders ? aggregations.newOrders : "0",
      revenue: aggregations.revenue.toLocaleString(undefined, {
        style: "currency",
        currency: app.currencyCode,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      // nbNewOrders: aggregations.newOrders,
      pendingOrders: aggregations.pendingOrders,
    }));
    // console.log(aggregations.pendingOrders);
    const { data: customers } = await dataProvider.getMany("parties", {
      ids: aggregations.pendingOrders.map((order) => order.party_id),
    });
    setState((state) => ({
      ...state,
      pendingOrdersCustomers: customers.reduce((prev, customer) => {
        prev[customer.id] = customer; // eslint-disable-line no-param-reassign
        return prev;
      }, {}),
    }));
  }, [dataProvider]);

  // const fetchReviews = useCallback(async () => {
  //   const { data: reviews } = await dataProvider.getList<Review>("reviews", {
  //     filter: { status: "pending" },
  //     sort: { field: "date", order: "DESC" },
  //     pagination: { page: 1, perPage: 100 },
  //   });
  //   const nbPendingReviews = reviews.reduce((nb) => ++nb, 0);
  //   const pendingReviews = reviews.slice(0, Math.min(10, reviews.length));
  //   setState((state) => ({ ...state, pendingReviews, nbPendingReviews }));
  //   const { data: customers } = await dataProvider.getMany<Customer>(
  //     "customers",
  //     {
  //       ids: pendingReviews.map((review) => review.customer_id),
  //     }
  //   );
  //   setState((state) => ({
  //     ...state,
  //     pendingReviewsCustomers: customers.reduce(
  //       (prev: CustomerData, customer) => {
  //         prev[customer.id] = customer; // eslint-disable-line no-param-reassign
  //         return prev;
  //       },
  //       {}
  //     ),
  //   }));
  // }, [dataProvider]);

  useEffect(() => {
    fetchOrders();
    // fetchReviews();
  }, [version]); // eslint-disable-line react-hooks/exhaustive-deps

  const {
    nbNewOrders,
    nbPendingReviews,
    pendingOrders,
    pendingOrdersCustomers,
    pendingReviews,
    pendingReviewsCustomers,
    revenue,
    recentOrders,
    newOrders,
  } = state;
  return isXSmall ? (
    <div>
      <div style={styles.flexColumn}>
        <MonthlyRevenue value={revenue} />
        <VerticalSpacer />
        <NewOrders value={newOrders} />
        <VerticalSpacer />
        {/* <PendingOrders
          orders={pendingOrders}
          customers={pendingOrdersCustomers}
        /> */}
      </div>
    </div>
  ) : isSmall ? (
    <div style={styles.flexColumn}>
      <div style={styles.flex}>
        <MonthlyRevenue value={revenue} />
        <Spacer />
        <NewOrders value={newOrders} />
      </div>
      <div style={styles.singleCol}>
        <OrderChart orders={recentOrders} />
      </div>
      <div style={styles.singleCol}>
        <PendingOrders
          orders={pendingOrders}
          customers={pendingOrdersCustomers}
        />
      </div>
    </div>
  ) : (
    <>
      <div style={styles.flex}>
        <div style={styles.leftCol}>
          <div style={styles.flex}>
            <MonthlyRevenue value={revenue} />
            <Spacer />
            <NewOrders value={newOrders} />
          </div>
          <div style={styles.singleCol}>
            <OrderChart orders={recentOrders} />
          </div>
          <div style={styles.singleCol}>
            {/* <PendingOrders
              orders={pendingOrders}
              customers={pendingOrdersCustomers}
            /> */}
          </div>
        </div>
        <div style={styles.rightCol}>
          <div style={styles.topZeroMargin}>
            {/* <PendingReviews
              nb={nbPendingReviews}
              reviews={pendingReviews}
              customers={pendingReviewsCustomers}
            /> */}
            <NewCustomers />
          </div>
          <div style={styles.singleCol}>
            <Spacer />
            <PendingOrders
              orders={pendingOrders}
              customers={pendingOrdersCustomers}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
