import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  createContactController,
  deleteContactByIdController,
  getContactByIdController,
  getContactsController,
  patchContactController,
  putContactController,
} from '../controllers/contacts.js';

import { validateBody } from '../middleware/validateBody.js';
import{ createContactSchema } from '../validation/createContactSchema.js';
import { updateContactSchema } from '../validation/updateContactSchema.js';
import { ROLES } from '../constants/constants.js';
import { checkRoles } from '../middleware/checkRoles.js';
import { authenticate } from '../middleware/authenticate.js';


const contactsRouter = Router();

contactsRouter.use('/', authenticate);

contactsRouter.get(
  '/',
  ctrlWrapper(getContactsController),
);

contactsRouter.get(
  '/:contactId',
  ctrlWrapper(getContactByIdController),
);

contactsRouter.post(
  '/',
  validateBody(createContactSchema),
  ctrlWrapper(createContactController),
);

contactsRouter.put(
  '/:contactId',
  validateBody(createContactSchema),
  ctrlWrapper(putContactController),
);

contactsRouter.patch(
  '/:contactId',
  validateBody(updateContactSchema),
  ctrlWrapper(patchContactController),
);

contactsRouter.delete(
  '/:contactId',
  ctrlWrapper(deleteContactByIdController),
);

export default contactsRouter;