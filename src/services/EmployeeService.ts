export interface IEmployeeService {
    getList(): Promise<IEmployee[]>;
}

export interface IEmployee {
    id: number;
    firstName: string;
    lastName: string;
    birthDate: string;
    position: string;
    phoneNumber: string;
}

export class EmployeeService implements IEmployeeService {
    getList(): Promise<IEmployee[]> {
        throw new Error("Method not implemented.");
    }
}