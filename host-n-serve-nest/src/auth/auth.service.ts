import { Body, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import mongoose from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { authModel } from './auth.model';
import Stripe from 'stripe';
import * as jwt from 'jsonwebtoken';
const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY, {
  apiVersion: '2020-08-27',
});
import * as fs from 'fs'

@Injectable()
export class AuthService {
  async registerUser(
    email: string,
    first_name: string,
    last_name: string,
    pwd: string,
    domain: string,
  ) {
    const user_id = uuidv4();
    const sanitized_email = email.toLowerCase();
    const existing_user = await authModel.findOne({ domain: domain });

    if (existing_user === null) {
      const customer = await stripe.customers.create(
        {
          email,
        },
        {
          apiKey: process.env.STRIPE_PRIVATE_KEY,
        },
      );

      const salt = bcrypt.genSaltSync(11);
      const hash = bcrypt.hashSync(pwd, salt);
      const new_user = new authModel({
        user_id,
        email: sanitized_email,
        domain,
        first_name,
        last_name,
        hashed_PWD: hash,
        stripe_customer_id: customer.id,
      });



      await new_user.save();
      const motherFolder = "/var/www"
      if(!fs.existsSync(`${motherFolder}/${domain}`)){
        fs.mkdir(`${motherFolder}/${domain}`, (err) => {
          if(err) {
            return {
              status: HttpStatus.BAD_REQUEST,
              message: "Email in use",
              user_exists: true
            }
          }
        });
      }

      return {
        status: HttpStatus.CREATED,
        message: "Successfully registered",
        user_exists: false
      };
    } else {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: 'Email already in use',
          user_exists: true
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async verifyUser(auth: string) {
    const jwt_decoded: any = jwt.decode(auth);

    return {
      id: jwt_decoded.user_id
    }
  }

  async getUserInfo(auth: string): Promise<{domain : string}>{
    const jwt_decoded: any = jwt.decode(auth);

    return {
      domain: jwt_decoded.domain
    }
  }

  async signin(domain: string, pwd: string) {
    const userDomain = await authModel.findOne({ domain: domain });

    if (userDomain !== null) {
      const user = await authModel.find({domain: domain});
      if (user[0].domain === domain) {
        const check_passwords = bcrypt.compareSync(pwd, user[0].hashed_PWD);
        if (check_passwords === true) {
          const jwt_user = {
            user_id: user[0].user_id,
            email: user[0].email,
            first_name: user[0].first_name,
            last_name: user[0].last_name,
            domain: domain,
            stripe_customer_id: user[0].stripe_customer_id,
            _id: user[0]._id,
            __v: 0,
          };
          const token = jwt.sign(jwt_user, domain, {
            expiresIn: 60 * 24,
          });
          return {
            status: HttpStatus.OK,
            token
          };
        } else {
          throw new HttpException(
            {
              status: HttpStatus.BAD_REQUEST,
              message: 'Wrong login information',
            },
            HttpStatus.BAD_REQUEST,
          );
        }
      } else {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            message: 'Wrong login information',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    } else {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: 'Wrong login information',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
