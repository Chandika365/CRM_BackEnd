import {
  addNewContact,
  deleteContact,
  getContacts,
  getContactWithID,
  updateContact,
} from "../controllers/crmControllers";
import { login, register, loginRequired } from "../controllers/userControllers";

const routes = (app) => {
  app
    .route("/contact")
    .get(
      (req, res, next) => {
        //middleware
        console.log(`Request from : ${req.originalUrl}`);
        console.log(`request type: ${req.method}`);
        next();
      },
      loginRequired,
      getContacts
    )

    // post a new contact
    .post(loginRequired, addNewContact);

  app
    .route("/contact/:contactId")
    // get specific contact
    .get(loginRequired, getContactWithID)

    // update a contact
    .put(loginRequired, updateContact)

    // to delete a contact
    .delete(loginRequired, deleteContact);

  //registation route
  app.route("/auth/register")
  .post(register);

  //login route
  app.route("/login")
  .post(login);
};

export default routes;
