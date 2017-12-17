import { User } from "../../models/user";
import { DataAccessObjects } from "../objects/DataAccessObjects";

export class DataAccess {
    public dataAccessObjects = new DataAccessObjects();
    public usersArray: User[] = [];
}
