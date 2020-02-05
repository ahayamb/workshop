import { WebhookRequest, WebhookResponse } from 'dialogflow';
import { IntentHandler } from "../fulfillment.service";
import { Injectable } from '@nestjs/common';

@Injectable()
export class CreditSimulation implements IntentHandler {

    private MAIN_CONTEXT = 'demo_-_credit_simulation_dialog_context';
    private ALTERNATIVE_CONTEXT = 'demo-credit-simulation';
    private MAIN_EVENT = 'demo-credit-simulation-evt';
    private DEFAULT_STRING = "other";

    isIntentMatch = async (request: WebhookRequest): Promise<boolean> => {
        return request.queryResult.intent.displayName === "demo - credit simulation";
    }

    handleIntent = async (request: WebhookRequest): Promise<WebhookResponse> => {
        const response: WebhookResponse = {};

        if (request.queryResult.queryText === this.MAIN_EVENT) {
            const eventContext = request.queryResult.outputContexts.filter(x => x.name.endsWith(this.MAIN_EVENT))[0];
            const deletedParameter = eventContext.parameters.deletedParameter;
            if (deletedParameter) {
                response.fulfillmentText = `Input ${deletedParameter} anda salah\n${request.queryResult.fulfillmentText}`;
            }

            return response;
        }

        await this.processParameter(request, response);

        return response;
    }

    private processParameter = async (request: WebhookRequest, response: WebhookResponse): Promise<void> => {
        const context = request.queryResult.outputContexts
            .filter(x => x.name.endsWith(this.MAIN_CONTEXT) || x.name.endsWith(this.ALTERNATIVE_CONTEXT))[0];

        if (!context) {
            return;
        }

        let deletedParameter = '';
        const contextParameters = context.parameters;

        let vehiclePrice = contextParameters['vehiclePrice'];
        let vehicleCondition = contextParameters['vehicleCondition'];
        let vehicleYear = contextParameters['vehicleYear'];
        let insuranceType = contextParameters['insuranceType'];

        // resolve parameter
        if (vehiclePrice) {
            vehiclePrice = this.resolveVehiclePrice(vehiclePrice);
            contextParameters['vehiclePrice'] = vehiclePrice;
        }
        if (vehicleCondition) {
            vehicleCondition = this.resolveVehicleCondition(vehicleCondition);
            contextParameters['vehicleCondition'] = vehicleCondition;
        }
        if (vehicleCondition === 'baru') {
            contextParameters['vehicleYear'] = new Date().getFullYear();
        }
        if (insuranceType) {
            insuranceType = this.resolveInsuranceType(insuranceType);
            contextParameters['insuranceType'] = insuranceType;
        }

        // validate parameter
        if (!this.isValidVehiclePrice(vehiclePrice)) {
            contextParameters['vehiclePrice'] = '';
            deletedParameter = 'vehiclePrice';
        } else if (!this.isYearValid(vehicleYear)) {
            contextParameters['vehicleYear'] = '';
            deletedParameter = 'vehicleYear';
        } else if (!this.isValidVehicleCondition(vehicleCondition)) {
            contextParameters['vehicleCondition'] = '';
            deletedParameter = 'vehicleCondition';
        } else if (!this.isValidInsuranceType(insuranceType)) {
            contextParameters['insuranceType'] = '';
            deletedParameter = 'insuranceType';
        }

        context.parameters = {...contextParameters, deletedParameter};

        response.outputContexts = [context];
        response.followupEventInput = {
            name: this.MAIN_EVENT,
            parameters: context.parameters,
            languageCode: 'id-ID'
        }
    }

    // validator
    private isValidVehiclePrice = (price: number): boolean => {
        return !Boolean(price) || (price > 10000000 && price < 1000000000);
    }

    private isYearValid = (year: number): boolean => {
        return !Boolean(year) || (year > 1800 && year <= new Date().getFullYear());
    }

    private isValidVehicleCondition = (condition: string): boolean => {
        return !Boolean(condition) || (condition !== this.DEFAULT_STRING);
    }

    private isValidInsuranceType = (insurance: string): boolean => {
        return !Boolean(insurance) || (insurance !== this.DEFAULT_STRING);
    }

    // resolver
    private resolveVehiclePrice = (price: {number: number, abbv: string}): number => {
        if (!price.number && !price.abbv) {
            return undefined;
        }

        const number = price.number;
        let multiplier = 1;
        switch (price.abbv) {
            case "rb":
                multiplier = 1000;
            case "juta":
                multiplier = 1000000;
                break;
            case "miliar":
                multiplier = 1000000000;
                break;
            default:
                multiplier = 1;
                break;
        }

        return number * multiplier;
    }
    
    private resolveVehicleCondition = (condition: {VehicleCondition: string, Other: string} | string): string => {
        if (typeof condition === 'string') {
            return condition;
        }

        if (!condition.VehicleCondition && !condition.Other) {
            return "";
        }

        const other = condition.Other ? this.DEFAULT_STRING : condition.Other;

        return condition.VehicleCondition || other;
    }

    private resolveInsuranceType = (insurance: {InsuranceType: string, Other: string} | string): string => {
        if (typeof insurance === 'string') {
            return insurance;
        }

        if (!insurance.InsuranceType && !insurance.Other) {
            return "";
        }
        
        const other = insurance.Other ? this.DEFAULT_STRING : insurance.Other;

        return insurance.InsuranceType || other;
    }

}
