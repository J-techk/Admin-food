import React from "react";
import { useState } from "react";
import axios from "axios";
import { backendUrl, currency } from "../../App";
import { useEffect } from "react";
import "./Order.css";

const Order = ({ token }) => {
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    if (!token) {
      return null;
    }

    try {
      const response = await axios.post(
        backendUrl + "/api/order/list",
        {},
        { headers: { token } },
      );

      // console.log(response);
      if (response.data.success) {
        setOrders(response.data.order);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };
  // Handling changes from admin

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/order/status",
        { orderId, status: event.target.value },
        { headers: { token } },
      );
      if (response.data.success) {
        await fetchAllOrders();
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };
  // Handling changes from admin ends here

  useEffect(() => {
    fetchAllOrders();
  }, [token]);
  return (
    <div>
      <h3 className="order-title">All Orders</h3>
      <div className="order-container">
        <table className="order-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Email</th>
              <th>Telephone</th>
              <th>Shipping Address</th>
              <th>Product Name</th>
              <th>Quantity</th>
              <th>Items</th>
              <th>Price</th>
              <th>Payment Method</th>
              <th>Payment Status</th>
              <th>Date</th>
              <th>Delivery Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={index}>
                <td>{order.address.firstName} </td>
                <td>{order.address.email} </td>
                <td>{order.address.phone} </td>
                <td>
                  {order.address.street},{order.address.city},
                  {order.address.state},{order.address.country},
                  {order.address.zipcode}
                </td>

                <td>
                  {order.items.map((item, index) => (
                    <p key={index}>{item.name} </p>
                  ))}{" "}
                </td>

                <td>
                  {order.items.map((item, index) => (
                    <p key={index}>{item.quantity} </p>
                  ))}
                </td>

                <td>{order.items.length} </td>
                <td>
                  {currency}
                  {order.amount}{" "}
                </td>
                <td>{order.paymentMethod} </td>
                <td>{order.payment ? "Done" : "Pending"} </td>
                <td>{new Date(order.date).toLocaleString()} </td>
                <td>
                  <select
                    onChange={(event) => statusHandler(event, order._id)}
                    value={order.status}
                    className="order-status"
                  >
                    <option value="Order Placed">Order Placed</option>
                    <option value="Packing">Packing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Out For Delivery">Out For Delivery</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Order;
