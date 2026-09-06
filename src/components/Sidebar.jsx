import { Children } from "react";
import { Link } from "react-router-dom";

const links = [
  { link: "/dashboard", label: "Add Links" },
  { link: "/links-archive", label: "Links Archive" },
  { link: "/change-password", label: "Change Password" },
  { link: "/buy-credits", label: "Buy Credits" },
];

const Sidebar = () => {
  return (
    <div className='d-flex col-sm-12 col-md-3 mt-4 justify-content-end'>
      <div>
        <h1 className='display-6 lead'>Your Account</h1>
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
