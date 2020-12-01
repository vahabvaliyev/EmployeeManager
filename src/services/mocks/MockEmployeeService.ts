import { cloneDeep } from "lodash";
import { IEmployee, IEmployeeService } from "services/EmployeeService";

export class MockEmployeeSerice implements IEmployeeService {
    private readonly responseTime: number = 100;
    private readonly employeeList: IEmployee[] = [
        {
            id: 1,
            firstName: 'Alex',
            lastName: 'Smith',
            birthDate: '1992.02.12',
            position: 'Accountant',
            phoneNumber: '+994552221233',
        },
        {
            id: 2,
            firstName: 'Jason',
            lastName: 'White',
            birthDate: '1984.05.06',
            position: 'Director',
            phoneNumber: '+994702254411',
        },
        {
            id: 3,
            firstName: 'John',
            lastName: 'Doe',
            birthDate: '1997.03.11',
            position: 'Manager',
            phoneNumber: '+994504265511',
        },
        {
            id: 4,
            firstName: 'Eve',
            lastName: 'Scott',
            birthDate: '1992.01.06',
            position: 'HR',
            phoneNumber: '+994707707070',
        },
        {
            id: 5,
            firstName: 'Melissa',
            lastName: 'Anthony',
            birthDate: '1995.05.05',
            position: 'Manager',
            phoneNumber: '+994502223311',
        },
        {
            id: 6,
            firstName: 'Carrillo',
            lastName: 'Flores',
            birthDate: '1994.09.29',
            position: 'Designer',
            phoneNumber: '+994557657989',
        },
    ];

    public getList = (): Promise<IEmployee[]> => {
        // Simluate http request's response time;
        return new Promise((resolve) => {
            setTimeout(() => resolve(cloneDeep(this.employeeList)), this.responseTime);
        });
    }
}