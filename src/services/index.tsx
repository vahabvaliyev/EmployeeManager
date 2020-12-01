import React from 'react';
import { IEmployeeService } from './EmployeeService';
import { MockEmployeeSerice } from './mocks/mockEmployeeService';

interface IServices {
    employeeService: IEmployeeService;
}

export function buildServices(): IServices {
    const employeeService = new MockEmployeeSerice();
    return { employeeService };
}

const ServicesContext = React.createContext<IServices>(null);

export const ServicesProvider: React.FC<{ services: IServices }> = ({ services, children }) => {
    return <ServicesContext.Provider value={services}>{children}</ServicesContext.Provider>;
};

export function useServices(): IServices {
    return React.useContext(ServicesContext);
}
