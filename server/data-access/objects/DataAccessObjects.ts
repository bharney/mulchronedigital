import { ObjectId } from "mongodb";
import { User } from "../../models/user";

export class DataAccessObjects {
         public findUserByIdQuery(userId: string): Promise<object> {
           return new Promise((resolve, reject) => {
             if (userId === null) {
               reject(new Error("No user ID was provided at findUserByIdQuery(userId: string)"));
             }
             const query = { _id: new ObjectId(userId) };
             resolve(query);
           });
         }

         public usernameAndProfileImageProjection(): Promise<object> {
           return new Promise(resolve => {
             const projection = { username: 1, profileImage: 1, _id: 0 };
             resolve(projection);
           });
         }

         public usernamePasswordAndIdProjection(): Promise<object> {
           return new Promise(resolve => {
             const projection = { password: 1, _id: 1 };
             resolve(projection);
           });
         }

         public updateUserPasswordProjection(password: string, modifiedAt: string) {
           return new Promise((resolve, reject) => {
             if (password === null) {
               reject(new Error("No user modal was provided at updateUserPasswordProjection(user: User"));
             }
             if (modifiedAt === null) {
               reject(new Error("No modified at locale string provided at updateUserPasswordProjection(password: string, modifiedAt: string"));
             }
             const projection = { $set: { password: password, modifiedAt: modifiedAt } };
             console.log("projection:" + projection);
             resolve(projection);
           });
         }
       }
