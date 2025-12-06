// frontend/src/pages/AdminDashboard.js
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('userToken');

  useEffect(() => {
    if (!token) {
      navigate('/signin'); // redirect if not logged in
      return;
    }

    const fetchData = async () => {
      try {
        const [prodRes, orderRes, userRes] = await Promise.all([
          fetch(`${process.env.REACT_APP_BACKEND_URL}/api/products`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${process.env.REACT_APP_BACKEND_URL}/api/orders`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        // Check for errors
        if (!prodRes.ok || !orderRes.ok || !userRes.ok) {
          throw new Error('Failed to fetch admin data');
        }

        setProducts(await prodRes.json());
        setOrders(await orderRes.json());
        setUsers(await userRes.json());
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [token, navigate]);

  if (loading) return <div>Loading admin dashboard...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Admin Dashboard</h1>

      <section style={{ marginBottom: '30px' }}>
        <h2>Products</h2>
        <Link to="/admin/add-product" style={{ display: 'inline-block', marginBottom: '10px' }}>
          ➕ Add New Product
        </Link>
        {products.length === 0 ? (
          <p>No products found</p>
        ) : (
          <ul>
            {products.map((p) => (
              <li key={p._id}>
                {p.name} - ${p.price} - Stock: {p.countInStock}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2>Orders</h2>
        {orders.length === 0 ? (
          <p>No orders found</p>
        ) : (
          <ul>
            {orders.map((o) => (
              <li key={o._id}>
                Order #{o._id} - {o.totalPrice} USD - {o.isPaid ? 'Paid' : 'Pending'}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2>Users</h2>
        {users.length === 0 ? (
          <p>No users found</p>
        ) : (
          <ul>
            {users.map((u) => (
              <li key={u._id}>
                {u.name} - {u.email} {u.isAdmin && '(Admin)'}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default AdminDashboard;
