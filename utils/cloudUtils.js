const extractEmployeeIdFromPaycheck = (paycheckText) => {
    const fileData = paycheckText.toString().split("\n");
    const newEmployeeId = fileData[7].substring(fileData[7].indexOf("0")).trim();
    return newEmployeeId;
}

module.exports = {extractEmployeeIdFromPaycheck};