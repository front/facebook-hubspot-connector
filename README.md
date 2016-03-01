# Facebook Hubspot Connector
This app allows contacts received from a Facebook ad to be sent directly into a Hubspot contact list.


## Requirements
* On Facebook
	* **A form ad** (with a full_name and email fields)
* On Hubspot
	* **Contact list**
	* **An API key**
* Nodejs 4.0.0 or greater


## Architecture

Whenever a Facebook ad form is submitted, a leadgen event is sent to the Facebook page that the ad belongs to. So we need to create a Facebook app that subscribes to events of that page. This Facebook app will have a webhook to our connector app (this repo), which will then post the contact into a Hubspot list.


## Setup

### 1. Create a new Facebook app

This Facebook app will be used to subscribe to the events from the Facebook page.

![Facebook App](./docs/img-7.png?raw=true)

Setup the **app domain** and **website** as "localhost". Take note of the App Id.


### 2. Clone this repo and install the packages

Start by cloning the repo and installing the npm packages.

```
$ git clone https://github.com/front/facebook-hubspot-connector.git
$ cd facebook-hubspot-connector/
$ npm install
```

### 3. Setup the application event subscription

Next we'll setup the Facebook App subscription. We need to pass the Facebook App Id as a parameter. This is done through an environment variables.

```
$ APP_ID="172XXXXXXXX" node index.js
```

This starts a webserver on port 5000. Use any browser to go to `http://localhost:5000/setup`. The host part can be different but needs to be the same as on the Facebook App settings.

There click on the "**Login with Facebook**" button. It will show a list of Facebook pages that you have admin access to.

![Page list](./docs/img-6.png?raw=true)

Now click on the page name to make the app subscribe to events of that page. The interface will show the Facebook Page Id and Facebook Page token. The **Page Token** will be necessary to retrieve the **Leadgen** info from Facebook.

![Page Id and token](./docs/img-5.png?raw=true)

Copy the **Page Id** and **Page Token**.

### 4. Increase the Page token TTL

Facebook tokens are very short lived. So, to make it usable in a medium term scenario we need to request an extension. This is done through Facebook's **Access Token Debugger**.

Go to [https://developers.facebook.com/tools/debug/accesstoken](https://developers.facebook.com/tools/debug/accesstoken)

There, enter the Page token and click debug. It will show the token info.

![Token Info](./docs/img-4.png?raw=true)

Then click on the "**Extend Access Token**" button. This will extend the token ttl for 2 months.


### 5. Start the nodejs app with the token and key

Now that we have a valid access token we can start our app passing it as a parameter. We will also need a couple of other parameters:

* The page token. Retrived previously (**PAGE_TOKEN**).
* A verify token for facebook requests (**FB_VERIFY**). Just choose any random string. We'll use "**abc123**" on this example.
* The Hubspot API key (**HS_KEY**)
* The Hubspot list id (**HS_LIST**)

> Also, at this point, this app needs to be publically accessible. Personally, I recommend using Heroku. You can follow the setup tutorial here: [https://devcenter.heroku.com/articles/getting-started-with-nodejs](https://devcenter.heroku.com/articles/getting-started-with-nodejs)

So, we start the server with:

```
$ APP_ID='172XXXXXXXX' PAGE_TOKEN='<your-fb-page-token>' FB_VERIFY='abc123' HS_KEY='<your-hubspot-api-key>' HS_LIST=<hubspot-list-id> node index.js
```

> If any parameter is missing. The console will show a message saying "**[Module] vars not set!**". Just check the parameter names and try again.

Now we're ready to setup the webhook on the Facebook app.


### 6. Facebook webhook setup

On Facebook app interface, go to the "**Webhooks**" tab, then click on "**New Subscrition**" **>** "**Page**".

![Hook setup](./docs/img-3.png?raw=true)

On the url, enter the public app domain followed by "**/facebook**" (the example shows it hosted on Heroku). Then enter "**abc123**" as the verify token and choose the "**leadgen**" field.

Facebook will now make a request to our app and confirm the subscription.


### 7. Confirming the setup on Graph API Explorer

We can check if everything is setup correctly by using Facebook's **Graph API Explorer**. So, go to: [https://developers.facebook.com/tools/explorer/](https://developers.facebook.com/tools/explorer/)

There, set **Page token** (obtained previously) and then enter the **App id** on the request input followed by "**/subscribed_apps**".

![Subscribed Apps](./docs/img-2.png?raw=true)

Your Facebook App should be one of the list items on the reponse. If not, it maybe necessary to repeat steps 3 through 5. But, confirm first that you're using the correct Page Access Token.

<hr>

You can also check if the webhook is setup correctly. For that, choose your application from the dropdown menu. Then write on the request input "**subscriptions**".

![Subscriptions](./docs/img-1.png?raw=true)

This should show this node app as the subscribed webhook.


### 8. Checking the data on Hubspot

So, whenever an ad form is submitted on Facebook, the contact is added to Hubspot list. It usually takes some minutes for the whole process to complete. So don't freak out if you don't see results right away.

![Hubspot List](./docs/img-0.png?raw=true)


### 9. Maintenance

Everything should be setup correctly at this point. It's now just a matter of making a few tests. If more fields are needed on Hubspot, you can change the parsing on the "**facebook.js**" file, **getLeadInfo()** method. However those fields need to be available to the Facebook Ad form first.

The only thing required now is to update the Page Access Token every 2 months. That usually means running steps 3 through 5.

## License

[MIT](https://en.wikipedia.org/wiki/MIT_License)

Copyright (c) 2016 Frontkom
