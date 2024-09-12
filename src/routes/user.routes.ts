import { Router } from 'express';
import {
  changeCurrentPassword,
  getAllUsers,
  getCurrentUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  updateAccountDetails,
  updateUserAvatar
} from '../controllers/user.controller';
import { upload } from '../middlewares';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

router.route('/').get(getAllUsers);
router.route('/register').post(upload.single('avatarImage'), registerUser);
router.route('/login').post(loginUser);

//secured routes
router.route('/logout').post(verifyJWT, logoutUser);
router.route('/refresh-token').post(refreshAccessToken);
router.route('/change-password').post(verifyJWT, changeCurrentPassword);
router.route('/current-user').get(verifyJWT, getCurrentUser);
router.route('/update-account').patch(verifyJWT, updateAccountDetails);
router
  .route('/avatar')
  .patch(verifyJWT, upload.single('avatarImage'), updateUserAvatar);

export default router;
