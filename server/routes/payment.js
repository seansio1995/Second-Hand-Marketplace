
const stripe = require("stripe")("");
const stripeChargeCallback = res => (stripeErr, stripeRes) => {
    if (stripeErr) {
        res.status(500).send({ error: stripeErr });
    } else {
        res.status(200).send({ success: stripeRes });
    }
};const paymentApi = app => {
    app.get("/", (req, res) => {
        res.send({
            message: "Hello Stripe checkout server!",
            timestamp: new Date().toISOString()
        });
    });

    app.post("/", (req, res) => {
        const body = {
            source: req.body.tokenId,
            amount: req.body.amount,
            currency: "usd"
        };
        console.log(req.body.tokenId);
        console.log(req.body.amount);
        stripe.charges.create(body, stripeChargeCallback(res));
    });  return app;
};

module.exports = paymentApi;