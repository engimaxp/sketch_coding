
/* Just for code completion and compilation - defines
    * the interface of objects stored in the phones table.
    */
export interface PhoneNumber {
    id?: number;
    contactId: number;
    type: string;
    phone: string;
}
