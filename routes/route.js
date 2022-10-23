import { Router } from "express";
import { login, logout, register } from "../controllers/auth.js";

import { create_Categories, create_transaction, delete_transaction, get_Categories, get_labels, get_transaction } from "../controllers/controller.js";
import { getUsers } from "../controllers/users.js";

const router = Router();

router.route("/categories")
    .post(create_Categories)
    .get(get_Categories)

router.route("/labels")
    .get(get_labels)


router.route("/transaction")
    .post(create_transaction)
    .get(get_transaction)
    .delete(delete_transaction)


    router.post('/register', register)
    router.post('/login', login)
    router.get('/logout', logout)
    router.get('/users', getUsers)

export default router;