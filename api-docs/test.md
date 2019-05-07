**Test**
----
  Returns json data about an API.

* **URL**

 /location/test

* **Method:**

  `GET`
  
*  **URL Params**

   **Required:**
 
   None

* **Data Params**

  None

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `{"success":true}`
 
* **Error Response:**

  * **Code:** 404 <br />
    **Content:** ``

  <!-- OR

  * **Code:** 401 UNAUTHORIZED <br />
    **Content:** `{ error : "You are unauthorized to make this request." }` -->

* **Sample Call:**

  ```javascript
    $.ajax({
      url: "/location/test",
      dataType: "json",
      type : "GET",
      success : function(r) {
        console.log(r);
      }
    });
  ```