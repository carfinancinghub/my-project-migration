import logger from '@utils/logger';
export function validate(schema) {
    return (req, res, next) => {
        try {
            if (schema) {
                const { error } = schema.validate(req.body);
                if (error) {
                    logger.warn('Validation failed', { error: error.details, timestamp: new Date().toISOString() });
                    return res.status(400).json({ message: error.details[0].message });
                }
            }
            next();
        }
        catch (err) {
            const error = err;
            logger.error('Validation error', { error: error.message, timestamp: new Date().toISOString() });
            next(error);
        }
    };
}
