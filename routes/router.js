const router = require("express").Router();
const verifyRole = require("../middleware/verifyRole");
const verifyToken = require("../middleware/verifyToken")
const usersDB = require("../models/user_model");
const model = require("../models/model");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const checkPermissions = require('../middleware/verifyPermission')

router.get("/user", verifyToken, checkPermissions({ role: 'super_admin' || 'admin', permissions: ['can_view_users'] }), async (req, res) => {
  try {
    const users = await usersDB.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ err });
  }
});

router.put('/user', verifyToken, async (req, res) => {
  const { id } = req.user
  const { name, email, username } = req.body
  try {
    const findUser = await model.findById('users', id)
    const users = await model.updateById('users', id, {
      name: name || findUser[0].name,
      email: email || findUser[0].email,
      username: username || findUser[0].username
    })
    if (findUser.length === 0) {
      return res.status(400).json('User Not Found')
    }

    return res.status(200).json(users)
  } catch (err) {
    res.status(500).json({ err });
  }
})

router.put('/user/:id', verifyToken, checkPermissions({ role: 'super_admin' || 'admin', permissions: ['can_edit_users'] }), async (req, res) => {
  const { id } = req.params
  const { name, email, username } = req.body
  try {
    const findUser = await model.findById('users', id)
    const users = await model.updateById('users', id, {
      name: name || findUser[0].name,
      email: email || findUser[0].email,
      username: username || findUser[0].username
    })
    if (findUser.length === 0) {
      return res.status(400).json('User Not Found')
    }

    return res.status(200).json(users)
  } catch (err) {
    res.status(500).json({ err });
  }
})

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body
    const users = await usersDB.find().where({ email: email }).select("*")
    if (users.length === 0) {
      return res.status(404).json({ message: "User Not Found" })
    }
    const verifyPassword = await bcrypt.compareSync(password, users[0].password)
    if (verifyPassword === false) {
      return res.status(404).json({ message: "Wrong Password" })
    }
    const token = await jwt.sign({ user: users[0] }, process.env.JWT_SECRET, { algorithm: 'HS256', expiresIn: '1h' })
    return res.status(200).json({ token: token })

  } catch (err) {
    return res.status(500).json({ err });
  }
})

router.post('/register', async (req, res) => {
  try {
    const { name, username, email, password, role } = req.body;
    const salt = await bcrypt.genSalt(10);
    const encryptedPass = await bcrypt.hash(password, salt);

    const users = await usersDB.addUser({ name, username, email, password: encryptedPass, role });

    const rolePermissions = {
      super_admin: { can_view_users: true, can_edit_users: true, can_create_users: true, can_delete_users: true },
      admin: { can_view_users: true, can_edit_users: true, can_create_users: true, can_delete_users: false },
      user: { can_view_users: false, can_edit_users: false, can_create_users: false, can_delete_users: false }
    };

    const userRole = users[0].role;
    const permission = await model.addOne('permissions', {
      user_id: users[0].id,
      ...rolePermissions[userRole]
    }, '*', true);

    const token = await jwt.sign({ user: users[0] }, process.env.JWT_SECRET, { algorithm: 'HS256', expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ err });
  }
});





module.exports = router