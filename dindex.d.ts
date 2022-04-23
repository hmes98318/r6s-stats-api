declare let platform: "pc" | "xbox" | "psn" | "ps4" | "ps5";
declare let name: string;
declare let operator: string;








export function general(platform: "pc" | "xbox" | "psn", name: any): Promise<any>;
export function casual(platform: any, name: any): Promise<any>;
export function rank(platform: any, name: any): Promise<any>;
export function unrank(platform: any, name: any): Promise<any>;
export function deathmatch(platform: any, name: any): Promise<any>;
export function operator(platform: any, name: any, operator: any): Promise<any>;
