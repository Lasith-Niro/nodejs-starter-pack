**Save one location data object**
----
  Upload one location data object into Firehose.

* **URL**

 /location/save

* **Method:**

  `POST`
  
*  **URL Params**

   **Required:**
 
   key : An API key which is provided for the SDK.

* **Body Params**

  dId : Device Identifier
  lat : Latitude
  lon : Longitude
  accuracy : Accuracy of the data
  capturedAt : The data captured timestamp

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `{"success":true}`
 
* **Error Response:**

  * **Code:** 404 <br />
    **Content:** ``

  <!-- OR

  * **Code:** 401 UNAUTHORIZED <br />
    **Content:** `{ error : "You are unauthorized to make this request." }` -->

* **Notes:**
    The API will reject 