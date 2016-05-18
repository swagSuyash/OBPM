import Controller from './Controller';
import NewUser from '../viewmodels/NewUser';
import UpdateUser from '../viewmodels/UpdateUser';
import ActionModel from '../decorators/ActionModel';
import ActionAuth from '../decorators/ActionAuthorization';
import AuthRepository from '../repositories/AuthRepository';
import * as q from 'q';
import httpErr from '../routing/HttpError';
import * as actionResult from '../routing/ActionResult';
import db, {Database} from '../db';
import ControllerContext from './ControllerContext';
import IModel from '../models/IModel';
import * as joi from 'joi';

/**
 * View Model Class used for changing the password of an exiting user.
 */
export class UpdatePasswordViewModel implements IModel {

    public userName: string;
    public oldPassword: string;
    public newPassword: string;

    getSchema(): joi.ObjectSchema {
        return joi.object({
            userName: joi.string().required(),
            oldPassword: joi.string().required(),
            newPassword: joi.string().required()
        });
    }
}

export default class UserController extends Controller {

    protected repo: AuthRepository;

    constructor(){
        super();
    }

    public init(context: ControllerContext): q.Promise<any>{
        return super.init(context).then(() => {
            return AuthRepository.getRepo().then(repo => {
                this.repo = repo;
            });
        });
    }

    /**
     * Creates a new user
     *
     * @method post
     *
     * @param {NewUser} $model
     *
     * @returns {q.Promise<any>} [description]
     */
    @ActionModel(NewUser, false)
    @ActionAuth(['admin'])
    post($model: NewUser, $user): q.Promise<any> {
        return this.repo.createUser($model);
    }

    @ActionModel(UpdateUser, false)
    @ActionAuth(['admin'])
    put($model: UpdateUser): q.Promise<any> {
        return this.repo.updateUser($model);
    }

    /**
     * Changes the password of an existing user.
     *
     * @method changePassword
     *
     * @param {User} $user The current user instance.
     * @param {UpdatePasswordViewModel} $model The view model containing the
     * update information.
     *
     * @returns {q.Promise}
     */
    @ActionModel(UpdatePasswordViewModel, false)
    @ActionAuth([])
    changePassword($user, $model: UpdatePasswordViewModel) {
        return this.repo.updatePassword(
            $user,
            $model.userName,
            $model.oldPassword,$model.newPassword
        );
    }
}
