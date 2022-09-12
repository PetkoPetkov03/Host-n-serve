import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { authModel } from 'src/auth/auth.model';
import * as jwt from 'jsonwebtoken';
import Stripe from 'stripe';
import { activeSubsModel } from './subscriptions.model';
import { paymentsModel } from './payments.model';
import { cuponsModel } from 'src/cupons/cuponsModel';
import { usedCuponModel } from 'src/cupons/usedCuponsModel';

const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY, {
  apiVersion: '2020-08-27',
});

@Injectable()
export class SubscriptionsService {
  async fetchSubs(AuthToken) {
    const jwt_decoded: any = jwt.decode(AuthToken);

    const potential_user_domain = jwt_decoded.domain;

    const user = await authModel.findOne({ domain: potential_user_domain });

    if (AuthToken === undefined || AuthToken === null || AuthToken === '') {
      throw new HttpException(
        {
          status: HttpStatus,
          message: 'Not authorized!',
        },
        HttpStatus.UNAUTHORIZED,
      );
    } else {
      if (user === null || user === undefined) {
        throw new HttpException(
          {
            status: HttpStatus,
            message: "User dosen't exist",
          },
          HttpStatus.BAD_REQUEST,
        );
      } else {
        const prices = await stripe.prices.list({
          apiKey: process.env.STRIPE_PRIVATE_KEY,
        });

        return prices;
      }
    }
  }

  async session(AuthToken, id, cupon_id) {
    const jwt_decoded: any = jwt.decode(AuthToken);

    const potential_user_id = jwt_decoded.user_id;

    const user = await authModel.findOne({ user_id: potential_user_id });

    if (AuthToken === undefined || AuthToken === null || AuthToken === '') {
      throw new HttpException(
        {
          status: HttpStatus,
          message: 'Unauthorized',
        },
        HttpStatus.UNAUTHORIZED,
      );
    } else {
      if (user === null || user === undefined) {
        throw new HttpException(
          {
            status: HttpStatus,
            message: 'Unauthorized',
          },
          HttpStatus.UNAUTHORIZED,
        );
      } else {
        console.log(cupon_id);

        const verifiedCuponId = cupon_id.length === 0 ? undefined : cupon_id;
        
        const session = await stripe.checkout.sessions.create(
          {
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [
              {
                price: id,
                quantity: 1,
              },
            ],
            discounts: [
              {
                coupon: verifiedCuponId
              }
            ],
            success_url: 'http://localhost:3000/',
            cancel_url: 'http://localhost:3000/',
            customer: jwt_decoded.stripe_customer_id,
          },
          {
            apiKey: process.env.STRIPE_PRIVATE_KEY,
          },
        );
        return session;
      }
    }
  }

  async log(AuthToken, id, nickname) {
    const jwt_decoded: any = jwt.decode(AuthToken);

    const potential_user_id = jwt_decoded.user_id;

    const user = await authModel.findOne({ user_id: potential_user_id });

    if (AuthToken === undefined || AuthToken === null || AuthToken === '') {
      throw new HttpException(
        {
          status: HttpStatus,
          message: 'Unauthorized',
        },
        HttpStatus.UNAUTHORIZED,
      );
    } else {
      if (user === null || user === undefined) {
        throw new HttpException(
          {
            status: HttpStatus,
            message: 'Unauthorized',
          },
          HttpStatus.UNAUTHORIZED,
        );
      } else {
        const user_active_plans = await activeSubsModel.findOne({
          domain: jwt_decoded.domain,
        });
        const retrived_session = await stripe.checkout.sessions.retrieve(id, {
          apiKey: process.env.STRIPE_PRIVATE_KEY.toString()
        });
        if (
          user_active_plans === undefined ||
          user_active_plans === null ||
          user_active_plans === ''
        ) {
          const price = retrived_session.amount_total;

          const prices_model = new paymentsModel({
            price: price,
            subscription_id: retrived_session.subscription,
          });

          await prices_model.save();

          const subsciption = new activeSubsModel({
            subscription_id: retrived_session.subscription,
            domain: jwt_decoded.domain,
            user_id: potential_user_id,
            plan: nickname,
          });

          await subsciption.save();

          const findUsedCupon = await cuponsModel.findOne({
            user_id: potential_user_id
          })
          await cuponsModel.findOneAndRemove({
            user_id: findUsedCupon?.user_id
          });

          const createUsedCupon = new usedCuponModel({
            user_id: findUsedCupon.user_id,
            cupon_id: findUsedCupon.cupon_id
          });

          await createUsedCupon.save();

          return 201;
        } else {
          throw new HttpException(
            {
              status: HttpStatus,
              message: 'Unauthorized',
            },
            HttpStatus.UNAUTHORIZED,
          );
        }
      }
    }
  }

  async activeSubs(AuthToken) {
    const jwt_decoded: any = jwt.decode(AuthToken);

    const user_id = jwt_decoded.user_id;

    const subs = await activeSubsModel.find({ user_id: user_id });
    return {
      subs,
      email: jwt_decoded.email
    };
  }

  async cancelSub(AuthToken, id) {
    const jwt_decoded: any = jwt.decode(AuthToken);

    const domain = jwt_decoded.domain;
    const sub = await activeSubsModel.find({ subscription_id: id });

    if (domain === sub[0].domain) {
      await stripe.subscriptions.del(id, {
        apiKey: 'sk_test_51KePDWCbVy7RrHrNe2lAo11N1pZMVABoJBUZJ0oDuLxwVNSneYaaJgS8SUykgANvU0FLQBu82HcQ8wSZu9CKadLJ00jBpIVUa5'
      });
      await activeSubsModel.findOneAndDelete({ domain: domain, subscription_id: id });
      await paymentsModel.findOneAndRemove({ subscription_id: id});
      return 200;
    } else {
      throw new HttpException({
        status: HttpStatus,
        message: "Server ran into error"
      }, HttpStatus.AMBIGUOUS);
    }
  }

  async checkIfSubscribed(AuthToken) {
    const jwt_decoded: any = jwt.decode(AuthToken);

    const domain = jwt_decoded.domain;

    const sub = await activeSubsModel.findOne({ domain: domain });

    if (sub === null) {
      return false;
    }
    return true;
  }

  async calc(password) {
    if (password === process.env.SECRET_PASSWORD) {
      const payments = await paymentsModel.find({});

      let monthly = 0;

      for (let i = 0; i < payments.length; i++) {
        monthly += payments[i].price;
      }

      console.log(monthly);

      return { data: (monthly / 100) }
    }else{
      return;
    }
  }
}
