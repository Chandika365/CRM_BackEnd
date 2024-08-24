import { addNewContact, deleteContact, getContacts, getContactWithID, updateContact } from "../controllers/crmControllers"

const routes = (app) =>{
    app.route("/contact")
    .get((req,res, next)=>{
        //middleware
        console.log(`Request from : ${req.originalUrl}`)
        console.log(`request type: ${req.method}`)
        next();
       
    }, getContacts)
  
    // post a new contact
    .post (addNewContact)

    app.route("/contact/:contactId")
    // get specific contact 
    .get(getContactWithID)

// update a contact
    .put(updateContact)

// to delete a contact
    .delete(deleteContact)
}

export default routes;