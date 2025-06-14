console.log("Shipment Form using JSONPowerDB");

const jpdbBaseURL = "http://api.login2explore.com:5577";
const jpdbIRL = "/api/irl";
const jpdbIML = "/api/iml";
const dbName = "DELIVERY-DB";
const relationName = "SHIPMENT-TABLE";
const connToken = "90934575|-31949213178401002|90956586";

const saveRecNo2LS = (jsonObj) => {
    const data = JSON.parse(jsonObj.data);
    localStorage.setItem("recno", data.rec_no);
};

const getShipmentNoAsJsonObj = () => {
    const shipmentNo = $("#shipmentNo").val();
    return JSON.stringify({ id: shipmentNo });
};

const fillData = (jsonObj) => {
    saveRecNo2LS(jsonObj);
    const record = JSON.parse(jsonObj.data).record;
    $("#description").val(record.description);
    $("#source").val(record.source);
    $("#destination").val(record.destination);
    $("#shipDate").val(record.shipDate);
    $("#deliveryDate").val(record.deliveryDate);
};

const resetForm = () => {
    $("#shipmentNo, #description, #source, #destination, #shipDate, #deliveryDate").val("");
    $("#shipmentNo").prop("disabled", false);
    $("#save, #change, #reset").prop("disabled", true);
    $("#shipmentNo").focus();
};

const validateData = () => {
    const shipmentNo = $("#shipmentNo").val();
    const description = $("#description").val();
    const source = $("#source").val();
    const destination = $("#destination").val();
    const shipDate = $("#shipDate").val();
    const deliveryDate = $("#deliveryDate").val();

    if (!shipmentNo) {
        alert("Shipment No. is required");
        $("#shipmentNo").focus();
        return "";
    }

    if (!description) {
        alert("Description is required");
        $("#description").focus();
        return "";
    }

    if (!source) {
        alert("Source is required");
        $("#source").focus();
        return "";
    }

    if (!destination) {
        alert("Destination is required");
        $("#destination").focus();
        return "";
    }

    if (!shipDate) {
        alert("Shipping Date is required");
        $("#shipDate").focus();
        return "";
    }

    if (!deliveryDate) {
        alert("Expected Delivery Date is required");
        $("#deliveryDate").focus();
        return "";
    }

    const jsonStrObj = {
        id: shipmentNo,
        description,
        source,
        destination,
        shipDate,
        deliveryDate,
    };

    return JSON.stringify(jsonStrObj);
};

const getShipment = () => {
    const shipmentJson = getShipmentNoAsJsonObj();
    const getRequest = createGET_BY_KEYRequest(connToken, dbName, relationName, shipmentJson);
    jQuery.ajaxSetup({ async: false });
    const resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIRL);
    jQuery.ajaxSetup({ async: true });

    if (resJsonObj.status === 400) {
        $("#save, #reset").prop("disabled", false);
        $("#description").focus();
    } else if (resJsonObj.status === 200) {
        $("#shipmentNo").prop("disabled", true);
        fillData(resJsonObj);
        $("#change, #reset").prop("disabled", false);
        $("#description").focus();
    }
};

const saveData = () => {
    const jsonStr = validateData();
    if (!jsonStr) return;

    const putRequest = createPUTRequest(connToken, jsonStr, dbName, relationName);
    jQuery.ajaxSetup({ async: false });
    executeCommandAtGivenBaseUrl(putRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({ async: true });
    resetForm();
};

const changeData = () => {
    $("#change").prop("disabled", true);
    const jsonChg = validateData();
    const updateRequest = createUPDATERecordRequest(connToken, jsonChg, dbName, relationName, localStorage.getItem("recno"));
    jQuery.ajaxSetup({ async: false });
    executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({ async: true });
    resetForm();
};
