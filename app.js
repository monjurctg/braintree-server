const express =require("express")
const bodyParser = require("body-parser")
const braintree = require("braintree")
const path = require("path")

const app = express()
const  cors = require("cors")

app.set("views", path.join(__dirname,"views"))
app.set('view engine',"ejs")

app.use(bodyParser.urlencoded({extended:true}))
app.use(cors())



const geteway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: "4tnxh3nymdjttvpm",
    publicKey:"d92kvndm49t4npjj",
    privateKey: "11312cf8e653b3772c27a415a0e78cfd"                          // private
})

app.get("/",(req,res)=>{
    // res.render("index")
})

app.get("/client_token",(req,res)=>{
    geteway.clientToken.generate({},(err,response)=>{
        if(err){
            res.send(err)
        }
        else{
            res.send(response.clientToken)
        }
    })
})

app.post("/checkout",(req, res)=>{
    const nonceFromTheClient = req.body.payment_method_nonce
    const saleRequest ={
        amount:"10.00",
        paymentMethodNonce:nonceFromTheClient,
        options:{
            submitForSettlement:true
        }
    }

    geteway.transaction.sale(saleRequest,(err,response)=>{
        if(err){
            res.render("error",{err})
        }
        else if(response.success){
            // res.render("success",{response})
            geteway.transaction.find(response.transactionid,(err,transaction)=>{
                if(err){
                    res.render("error",{err})
                }
                else{
                    res.render("success",{transaction})
                }
            })
        }
        else{
            res.render("error",{error:err.message})
        }
    })



    })


    app.post('/api/create-ach-transfer', async (req, res) => {
        try {
          const { bankAccount, amount } = req.body;

          // Create ACH bank transfer
          const result = await gateway.transaction.sale({
            amount: amount,
            paymentMethodNonce: bankAccount.paymentMethodNonce,
            options: {
              submitForSettlement: true
            },
            customFields: {
              achMandate: bankAccount.achMandate
            }
          });

          if (result.success) {
            res.json({ message: 'ACH bank transfer successful!' });
          } else {
            res.status(500).json({ error: result.message });
          }
        } catch (error) {
          console.error('Error processing ACH bank transfer:', error);
          res.status(500).json({ error: 'Error processing ACH bank transfer' });
        }
      });

    app.listen(3000,()=>{
        console.log("Server is running on port 3000")
    })



