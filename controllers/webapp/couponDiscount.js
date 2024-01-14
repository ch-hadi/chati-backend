import connection from "../../config/db.js";
import Joi from "joi";


//Create Coupon Discount
export const giveCouponDiscount = async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send({ data: null, message: error.message });
    const { coupon_name, price, card_Id, domain_Id, email } = req.body;
    try {
        await connection.query(
            `SELECT A.*, B.cardsIds,B.domainIds FROM coupons A LEFT JOIN coupon_product B ON A.id=B.coupon_id WHERE A.coupon_name='${coupon_name}'`,
            function (err, result, fields) {
                // if any error while executing above query, throw error
                if (err) return res.status(400).send(err);
                // if there is no error, you have the result


                if (result.length > 0) {
                    if (result[0].discount_type === "fixed_cart") {
                        let data = price - result[0].coupon_amount;
                        data = data.toFixed(2)
                        for (let i = 0; i < result.length; i++) {
                            if (result[i].cardsIds || result[i].domainIds) {
                                if (result[i].cardsIds == card_Id) {
                                    if (result[i].allowed_emails) {
                                        if (result[i].allowed_emails === email) {
                                            //gives discount
                                            return res.status(201).send({ success: true, data, message: "Successfully coupon applied" })
                                        } else {
                                            //you are not autheniticate user for coupone
                                            //not gives discount 
                                            return res.status(201).send({ success: true, message: "Sorry, You are not allowed!" })
                                        }
                                    } else {
                                        //This coupon is valid for every users
                                        return res.status(201).send({ success: true, data, message: "Successfully coupon applied" })
                                    }

                                } else if (result[i].domainIds == domain_Id) {
                                    if (result[i].allowed_emails) {
                                        if (result[i].allowed_emails === email) {
                                            //gives discount
                                            return res.status(201).send({ success: true, data, message: "Successfully coupon applied" })
                                        } else {
                                            //you are not autheniticate user for coupone
                                            //not gives discount 
                                            return res.status(201).send({ success: true, message: "Sorry, You are not allowed!" })
                                        }
                                    } else {
                                        //This coupon is valid for every users
                                        return res.status(201).send({ success: true, data, message: "Successfully coupon applied" })
                                    }

                                }
                                else {
                                    //User Card is not exist for coupon
                                    //not gives discount 
                                    return res.status(201).send({ success: true, message: "Sorry, this coupon is not applicable to selected products." })
                                }
                            } else {
                                //gives discount without any restriction
                                return res.status(201).send({ success: true, data, message: "Successfully coupon applied" })
                            }

                        }


                    }
                    if (result[0].discount_type === "percent") {
                        let data = result[0].coupon_amount / 100;
                        let totalValue = data * price;
                        let finalResult = price - totalValue
                        return res.status(201).send({ success: true, value: finalResult })
                    }
                }
                res.status(200).send({ success: false, message: "Coupon is not vlaid", result })
            }
        );
    } catch (error) {
        res.status(500).send(error);
    }
};



function validate(data) {
    const schema = Joi.object({
        coupon_name: Joi.string().required(),
        price: Joi.number().required(),
        email: Joi.string().optional(),
        card_Id: Joi.number().optional(),
        domain_Id: Joi.number().optional(),
    });
    return schema.validate(data);
}
