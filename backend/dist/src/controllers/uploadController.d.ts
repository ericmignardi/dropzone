import type { Request, Response } from "express";
export declare const uploadFile: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const readFiles: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const readFile: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteFile: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const downloadFile: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=uploadController.d.ts.map