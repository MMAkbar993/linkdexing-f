import { Children, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { privateApi } from "../api";
import { authUrl } from "../api/endpoints";

const links = [
  { link: "/dashboard", label: "Add Links" },
  { link: "/links-archive", label: "Links Archive" },
  { link: "/change-password", label: "Change Password" },
  { link: "/buy-credits", label: "Buy Credits" },
];

const num = (n) => (n ?? 0).toLocaleString("en-US");

const Sidebar = () => {
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    let cancelled = false;
    privateApi
      .get(`${authUrl}/credits`)
      .then((res) => {
        if (!cancelled) setBalance(res.data.balance);
      })
      .catch(() => {
        // Non-fatal - the sidebar still works without the balance shown.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className='d-flex col-sm-12 col-md-3 mt-4 justify-content-end'>
      <div>
        <h1 className='display-6 lead'>Your Account</h1>

        {balance !== null && (
          <div
            className='mb-3 p-3'
            style={{
              background: "#f7f8f6",
              border: "1px solid #e5e8eb",
              borderRadius: 8,
            }}
          >
            <div style={{ fontSize: "0.85rem", color: "#6b7681" }}>
              Credit balance
            </div>
            <div style={{ fontSize: "1.6rem", fontWeight: 600 }}>
              {num(balance)}
            </div>
          </div>
        )}

        <ul style={{ fontSize: "1.3rem" }}>
          {Children.toArray(
            links.map(({ link, label }) => {
              return (
                <li>
                  <Link to={link}>{label}</Link>
                </li>
              );
            })
          )}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
