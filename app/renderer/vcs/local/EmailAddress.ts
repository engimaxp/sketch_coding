
/* Just for code completion and compilation - defines
    * the interface of objects stored in the emails table.
    */
export interface EmailAddress {
    id?: number;
    contactId: number;
    type: string;
    email: string;
}
