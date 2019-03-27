
import { RequestHandler } from "micro";

export interface MicroDevFlags {
  port: number;
  host: string;
  silent?: boolean;
  limit?: string;
}

export default function (flags: MicroDevFlags): (handler: RequestHandler) => {};
