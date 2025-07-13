import Joi from 'joi';

export const analyticsSchema = Joi.object({
  auctionId: Joi.string().required(),
  metric: Joi.string().valid('clicks', 'views', 'bids').required()
});
