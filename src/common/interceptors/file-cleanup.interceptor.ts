import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    Logger,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import * as fs from 'fs';

@Injectable()
export class FileCleanupInterceptor implements NestInterceptor {
    private readonly logger = new Logger(FileCleanupInterceptor.name);

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            catchError((error) => {
                const request = context.switchToHttp().getRequest();
                const file = request.file;
                const files = request.files;

                if (file && file.path) {
                    this.cleanupFile(file.path);
                }

                if (files) {
                    if (Array.isArray(files)) {
                        files.forEach((f) => this.cleanupFile(f.path));
                    } else {
                        Object.keys(files).forEach((key) => {
                            files[key].forEach((f) => this.cleanupFile(f.path));
                        });
                    }
                }

                return throwError(() => error);
            }),
        );
    }

    private cleanupFile(path: string) {
        if (fs.existsSync(path)) {
            fs.unlink(path, (err) => {
                if (err) {
                    this.logger.error(`Failed to delete file after error: ${path}`, err.stack);
                } else {
                    this.logger.warn(`Deleted file due to request error: ${path}`);
                }
            });
        }
    }
}
