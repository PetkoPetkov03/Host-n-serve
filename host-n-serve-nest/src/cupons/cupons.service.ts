import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { cuponsModel } from './cuponsModel';
import { usedCuponModel } from './usedCuponsModel';

const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY, {
    apiVersion: '2020-08-27',
});

@Injectable()
export class CuponsService {
    async genCupon(user_id) {

        const all_unsued_cupons = await cuponsModel.find({});
        const all_used_cupons = await usedCuponModel.find({});

        const all_cupons = all_unsued_cupons.length + all_used_cupons.length

        if(all_cupons === Number(process.env.CUPONS)) {
            return {
                cupon: "cupons depleated!"
            }
        }


        const existing_unused_cupons = await cuponsModel.findOne({
            user_id: user_id
        });

        const existing_used_cupons = await usedCuponModel.findOne({
            user_id: user_id
        });
        

        if (typeof existing_unused_cupons?.user_id === "undefined" && typeof existing_used_cupons?.user_id === "undefined") {
            const cupon = await stripe.coupons.create({
                percent_off: 100,
                duration: 'once',
                max_redemptions: 1,
            },{
                apiKey:process.env.STRIPE_PRIVATE_KEY,
            });

            const generatedCupon = new cuponsModel({
                user_id: user_id,
                cupon_id: cupon.id
            });

            await generatedCupon.save();

            return {
                cupon: cupon.id
            }
        }

        return {
            cupon: typeof existing_unused_cupons?.cupon_id === "undefined" ? existing_used_cupons?.cupon_id : existing_unused_cupons?.cupon_id
        }
    }

    async cuponsLeft() {
        const unused_cupons = await cuponsModel.find({});
        const used_cupons = await usedCuponModel.find({});
        

        const ammount_of_generated_cupons = unused_cupons.length + used_cupons.length;

        const cupons_left = Number(process.env.CUPONS) - ammount_of_generated_cupons;
        

        return {
            cupons_left: cupons_left
        };
    }

    async userCupon(user_id) {
        const cupon = await cuponsModel.findOne({
            user_id: user_id
        });

        if(typeof cupon === "undefined"){
            return {
                cupon: ""
            }
        }

        return {
            cupon: cupon
        }
    }
}
