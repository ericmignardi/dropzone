import type { User } from "../../generated/prisma/client.js";
export declare const register: (email: string, password: string, name: string) => Promise<{
    user: User;
    token: string;
}>;
export declare const login: (email: string, password: string) => Promise<{
    user: User;
    token: string;
}>;
export declare const logout: () => Promise<void>;
export declare const verify: () => Promise<void>;
//# sourceMappingURL=authService.d.ts.map