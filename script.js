// Mảng số nguyên chính của bài.
let integerArray = [];
let hasSavedIntegerArray = false;

// Lấy một phần tử HTML bằng id.
function getElement(id) {
  return document.getElementById(id);
}

// Hiển thị thông báo ở khu vực kết quả.
function showResult(message, type) {
  const result = getElement("functionResult");

  result.textContent = message;
  result.className = "mt-2 min-h-16 rounded-md p-3 text-sm";

  if (type === "error") {
    result.classList.add("bg-red-100", "text-red-800");
  } else if (type === "success") {
    result.classList.add("bg-green-100", "text-green-800");
  } else {
    result.classList.add("bg-gray-100", "text-gray-800");
  }
}

// Tách dữ liệu nhập vào thành các chuỗi số.
function splitInputValues(text) {
  const trimmedText = text.trim();

  if (trimmedText === "") {
    return [];
  }

  return trimmedText.split(/[,;\s]+/);
}

// Chuyển nội dung ô nhập thành mảng số nguyên.
function parseIntegerArray(text) {
  const parts = splitInputValues(text);
  const values = [];
  const integerPattern = /^[+-]?\d+$/;

  if (parts.length === 0) {
    return { values: [], error: "Bạn chưa nhập số nào." };
  }

  for (let i = 0; i < parts.length; i++) {
    if (!integerPattern.test(parts[i])) {
      return {
        values: [],
        error: `"${parts[i]}" không phải là số nguyên.`
      };
    }

    const number = Number(parts[i]);

    if (!Number.isSafeInteger(number)) {
      return {
        values: [],
        error: `"${parts[i]}" nằm ngoài phạm vi số nguyên an toàn.`
      };
    }

    values.push(number);
  }

  return { values: values, error: "" };
}

// Chuyển nội dung ô nhập thành mảng số thực.
function parseFloatArray(text) {
  const parts = splitInputValues(text);
  const values = [];
  const numberPattern = /^[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?$/i;

  if (parts.length === 0) {
    return { values: [], error: "Bạn chưa nhập số nào." };
  }

  for (let i = 0; i < parts.length; i++) {
    if (!numberPattern.test(parts[i])) {
      return {
        values: [],
        error: `"${parts[i]}" không phải là số hợp lệ.`
      };
    }

    const number = Number(parts[i]);

    if (!Number.isFinite(number)) {
      return {
        values: [],
        error: `"${parts[i]}" nằm ngoài phạm vi cho phép.`
      };
    }

    values.push(number);
  }

  return { values: values, error: "" };
}

// Bật các chức năng khi đã lưu mảng và cập nhật trạng thái.
function setFunctionControlsEnabled(enabled) {
  getElement("functionSelect").disabled = !enabled;
  getElement("runFunctionBtn").disabled = !enabled;

  const status = getElement("arrayStatus");

  if (enabled) {
    status.textContent = "Đã lưu";
    status.className = "rounded bg-green-100 px-2 py-1 text-sm text-green-800";
  } else {
    status.textContent = "Chưa lưu";
    status.className = "rounded bg-yellow-100 px-2 py-1 text-sm text-yellow-800";
  }
}

// Hiển thị mảng và cập nhật số lượng số dương, số âm.
function renderIntegerArray() {
  const arrayView = getElement("integerArrayView");
  arrayView.innerHTML = "";

  if (integerArray.length === 0) {
    const message = document.createElement("span");
    message.className = "text-sm text-gray-500";
    message.textContent = "Chưa có mảng.";
    arrayView.appendChild(message);
  } else {
    for (let i = 0; i < integerArray.length; i++) {
      const item = document.createElement("span");
      item.className = "rounded border border-gray-300 bg-white px-3 py-2 text-sm";
      item.textContent = `[${i}] ${integerArray[i]}`;
      arrayView.appendChild(item);
    }
  }

  updateArrayStatistics();
}

// Cập nhật các số liệu được hiển thị dưới tiêu đề mảng.
function updateArrayStatistics() {
  let positiveCount = 0;
  let negativeCount = 0;

  for (let i = 0; i < integerArray.length; i++) {
    if (integerArray[i] > 0) {
      positiveCount++;
    } else if (integerArray[i] < 0) {
      negativeCount++;
    }
  }

  getElement("totalCount").textContent = integerArray.length;
  getElement("positiveCount").textContent = positiveCount;
  getElement("negativeCount").textContent = negativeCount;
}

// Đọc dữ liệu, kiểm tra rồi lưu mảng số nguyên.
function saveIntegerArray() {
  const input = getElement("integerInput");
  const message = getElement("integerInputMessage");
  const result = parseIntegerArray(input.value);

  if (result.error !== "") {
    message.textContent = result.error;
    message.className = "mt-3 text-sm text-red-600";
    return;
  }

  integerArray = result.values;
  hasSavedIntegerArray = true;
  renderIntegerArray();
  setFunctionControlsEnabled(true);

  message.textContent = `Đã lưu ${integerArray.length} số.`;
  message.className = "mt-3 text-sm text-green-700";
  showResult("Chọn một chức năng để xử lý mảng.", "info");
}

// Xóa mảng và đưa giao diện về trạng thái ban đầu.
function clearIntegerArray() {
  integerArray = [];
  hasSavedIntegerArray = false;

  getElement("integerInput").value = "";
  getElement("floatInput").value = "";
  getElement("swapIndex1").value = "";
  getElement("swapIndex2").value = "";
  getElement("functionSelect").value = "sumPositive";

  const message = getElement("integerInputMessage");
  message.textContent = "Đã xóa mảng.";
  message.className = "mt-3 text-sm text-gray-500";

  renderIntegerArray();
  setFunctionControlsEnabled(false);
  updateFunctionOptions();
  showResult("Nhập và lưu mảng trước khi chọn chức năng.", "info");
}

// Hiện ô nhập bổ sung nếu chức năng đang chọn cần dữ liệu.
function updateFunctionOptions() {
  const selectedFunction = getElement("functionSelect").value;

  getElement("swapOptions").classList.toggle(
    "hidden",
    selectedFunction !== "swap"
  );
  getElement("floatOptions").classList.toggle(
    "hidden",
    selectedFunction !== "countIntegersInFloat"
  );

  const descriptions = {
    sumPositive: "Tính tổng các số lớn hơn 0 trong mảng.",
    countPositive: "Đếm các phần tử lớn hơn 0.",
    minimum: "Tìm giá trị nhỏ nhất trong mảng.",
    minimumPositive: "Tìm số dương nhỏ nhất trong mảng.",
    lastEven: "Tìm số chẵn cuối cùng; nếu không có thì kết quả là -1.",
    swap: "Nhập hai vị trí muốn đổi chỗ.",
    sort: "Sắp xếp các phần tử theo thứ tự tăng dần.",
    firstPrime: "Tìm số nguyên tố đầu tiên; nếu không có thì kết quả là -1.",
    countIntegersInFloat: "Nhập một mảng số thực để đếm số nguyên.",
    compareSigns: "So sánh số lượng số dương và số âm."
  };

  getElement("functionDescription").textContent =
    descriptions[selectedFunction];
}

/**
 * Tính tổng các số dương trong mảng
 *
 * * Input
 *      - Mảng số nguyên integerArray đã được lưu
 *
 * * Process
 *      - Tạo biến sum = 0
 *      - Lấy lần lượt từng phần tử trong mảng
 *      - Kiểm tra phần tử có lớn hơn 0 không
 *      - Nếu đúng, cộng phần tử đó vào sum
 *
 * * Output
 *      - Trả về tổng các số dương
 *      - Nếu mảng không có số dương, trả về 0
 */
function calculatePositiveSum() {
  let sum = 0;

  for (let i = 0; i < integerArray.length; i++) {
    if (integerArray[i] > 0) {
      sum += integerArray[i];
    }
  }

  return sum;
}

/**
 * Đếm số lượng số dương trong mảng
 *
 * * Input
 *      - Mảng số nguyên integerArray đã được lưu
 *
 * * Process
 *      - Tạo biến count = 0
 *      - Lấy lần lượt từng phần tử trong mảng
 *      - Kiểm tra phần tử có lớn hơn 0 không
 *      - Nếu đúng, tăng count lên 1
 *
 * * Output
 *      - Trả về số lượng số dương trong mảng
 */
function countPositiveNumbers() {
  let count = 0;

  for (let i = 0; i < integerArray.length; i++) {
    if (integerArray[i] > 0) {
      count++;
    }
  }

  return count;
}

/**
 * Tìm số nhỏ nhất trong mảng
 *
 * * Input
 *      - Mảng số nguyên integerArray đã được lưu
 *
 * * Process
 *      - Lấy phần tử đầu tiên làm giá trị nhỏ nhất tạm thời
 *      - Lấy lần lượt các phần tử còn lại để so sánh
 *      - Nếu phần tử đang xét nhỏ hơn giá trị tạm thời, cập nhật giá trị đó
 *
 * * Output
 *      - Trả về giá trị nhỏ nhất trong mảng
 */
function findMinimum() {
  let minimum = integerArray[0];

  for (let i = 1; i < integerArray.length; i++) {
    if (integerArray[i] < minimum) {
      minimum = integerArray[i];
    }
  }

  return minimum;
}

/**
 * Tìm số dương nhỏ nhất trong mảng
 *
 * * Input
 *      - Mảng số nguyên integerArray đã được lưu
 *
 * * Process
 *      - Tạo mảng positiveArray để chứa các số dương
 *      - Lấy lần lượt từng phần tử trong mảng
 *      - Nếu phần tử lớn hơn 0, thêm phần tử đó vào positiveArray
 *      - Kiểm tra positiveArray có phần tử hay không
 *      - Nếu có, lấy phần tử đầu làm nhỏ nhất tạm thời
 *      - Duyệt các phần tử còn lại và cập nhật số nhỏ nhất
 *
 * * Output
 *      - Trả về số dương nhỏ nhất tìm được
 *      - Trả về null nếu mảng không có số dương
 */
function findMinimumPositive() {
  const positiveArray = [];

  for (let i = 0; i < integerArray.length; i++) {
    if (integerArray[i] > 0) {
      positiveArray.push(integerArray[i]);
    }
  }

  if (positiveArray.length === 0) {
    return null;
  }

  let minimumPositive = positiveArray[0];

  for (let i = 1; i < positiveArray.length; i++) {
    if (positiveArray[i] < minimumPositive) {
      minimumPositive = positiveArray[i];
    }
  }

  return minimumPositive;
}

/**
 * Tìm số chẵn cuối cùng trong mảng
 *
 * * Input
 *      - Mảng số nguyên integerArray đã được lưu
 *
 * * Process
 *      - Tạo biến lastEven = -1
 *      - Duyệt lần lượt các phần tử trong mảng
 *      - Nếu phần tử chia hết cho 2, gán phần tử đó vào lastEven
 *      - Tiếp tục duyệt để các số chẵn phía sau thay thế giá trị trước đó
 *
 * * Output
 *      - Trả về số chẵn cuối cùng trong mảng
 *      - Trả về -1 nếu không tìm thấy số chẵn
 */
function findLastEvenNumber() {
  let lastEven = -1;

  for (let i = 0; i < integerArray.length; i++) {
    if (integerArray[i] % 2 === 0) {
      lastEven = integerArray[i];
    }
  }

  return lastEven;
}

/**
 * Đổi chỗ hai phần tử trong mảng
 *
 * * Input
 *      - Mảng số nguyên integerArray
 *      - Vị trí firstIndex và secondIndex của hai phần tử cần đổi
 *
 * * Process
 *      - Lưu giá trị ở firstIndex vào biến tạm
 *      - Gán giá trị ở secondIndex cho vị trí firstIndex
 *      - Gán giá trị trong biến tạm cho vị trí secondIndex
 *
 * * Output
 *      - Cập nhật integerArray với hai phần tử đã đổi chỗ
 */
function swapArrayValues(firstIndex, secondIndex) {
  const temporaryValue = integerArray[firstIndex];
  integerArray[firstIndex] = integerArray[secondIndex];
  integerArray[secondIndex] = temporaryValue;
}

/**
 * Sắp xếp mảng theo thứ tự tăng dần bằng Bubble Sort
 *
 * * Input
 *      - Mảng số nguyên integerArray đã được lưu
 *
 * * Process
 *      - So sánh lần lượt từng cặp phần tử đứng cạnh nhau
 *      - Nếu phần tử trước lớn hơn phần tử sau, đổi chỗ hai phần tử
 *      - Lặp lại các lượt so sánh cho đến khi mảng được sắp xếp
 *
 * * Output
 *      - Cập nhật integerArray theo thứ tự từ nhỏ đến lớn
 */
function sortArrayAscending() {
  for (let i = 0; i < integerArray.length - 1; i++) {
    for (let j = 0; j < integerArray.length - 1 - i; j++) {
      if (integerArray[j] > integerArray[j + 1]) {
        const temporaryValue = integerArray[j];
        integerArray[j] = integerArray[j + 1];
        integerArray[j + 1] = temporaryValue;
      }
    }
  }
}

// Kiểm tra một số có phải số nguyên tố hay không để dùng khi tìm số nguyên tố.
function isPrime(number) {
  if (number < 2) {
    return false;
  }

  for (let divisor = 2; divisor * divisor <= number; divisor++) {
    if (number % divisor === 0) {
      return false;
    }
  }

  return true;
}

/**
 * Tìm số nguyên tố đầu tiên trong mảng
 *
 * * Input
 *      - Mảng số nguyên integerArray đã được lưu
 *
 * * Process
 *      - Duyệt lần lượt các phần tử từ đầu mảng
 *      - Dùng hàm isPrime để kiểm tra từng phần tử
 *      - Nếu phần tử là số nguyên tố, gán vào firstPrime rồi dùng break
 *        để dừng vòng lặp
 *
 * * Output
 *      - Trả về số nguyên tố đầu tiên trong mảng
 *      - Trả về -1 nếu không tìm thấy số nguyên tố
 */
function findFirstPrime() {
  let firstPrime = -1;

  for (let i = 0; i < integerArray.length; i++) {
    if (isPrime(integerArray[i])) {
      firstPrime = integerArray[i];
      break;
    }
  }

  return firstPrime;
}

/**
 * Đếm số nguyên trong mảng số thực người dùng nhập
 *
 * * Input
 *      - Chuỗi số thực, các số được ngăn cách bằng dấu phẩy hoặc khoảng trắng
 *
 * * Process
 *      - Kiểm tra chuỗi và chuyển thành mảng số thực
 *      - Nếu dữ liệu không hợp lệ, trả về thông báo lỗi
 *      - Tạo biến count = 0
 *      - Duyệt mảng, dùng Number.isInteger để kiểm tra từng phần tử
 *      - Nếu phần tử là số nguyên, tăng count lên 1
 *
 * * Output
 *      - Trả về mảng số thực và số lượng số nguyên trong mảng
 *      - Trả về thông báo lỗi nếu dữ liệu nhập không hợp lệ
 */
function countIntegersInFloatArray(text) {
  const result = parseFloatArray(text);

  if (result.error !== "") {
    return { error: result.error };
  }

  let count = 0;

  for (let i = 0; i < result.values.length; i++) {
    if (Number.isInteger(result.values[i])) {
      count++;
    }
  }

  return {
    error: "",
    values: result.values,
    count: count
  };
}

/**
 * So sánh số lượng số dương và số âm trong mảng
 *
 * * Input
 *      - Mảng số nguyên integerArray đã được lưu
 *
 * * Process
 *      - Tạo hai biến positiveCount = 0 và negativeCount = 0
 *      - Duyệt lần lượt từng phần tử trong mảng
 *      - Nếu phần tử lớn hơn 0, tăng positiveCount lên 1
 *      - Nếu phần tử nhỏ hơn 0, tăng negativeCount lên 1
 *      - So sánh hai biến đếm để tìm loại số nhiều hơn
 *
 * * Output
 *      - Trả về số lượng số dương, số âm và kết luận so sánh
 */
function comparePositiveAndNegative() {
  let positiveCount = 0;
  let negativeCount = 0;

  for (let i = 0; i < integerArray.length; i++) {
    if (integerArray[i] > 0) {
      positiveCount++;
    } else if (integerArray[i] < 0) {
      negativeCount++;
    }
  }

  let conclusion = "Số lượng hai loại bằng nhau.";

  if (positiveCount > negativeCount) {
    conclusion = "Số dương nhiều hơn.";
  } else if (negativeCount > positiveCount) {
    conclusion = "Số âm nhiều hơn.";
  }

  return {
    positiveCount: positiveCount,
    negativeCount: negativeCount,
    conclusion: conclusion
  };
}

// Kiểm tra vị trí nhập vào trước khi đổi chỗ.
function runSwapFunction() {
  const firstText = getElement("swapIndex1").value.trim();
  const secondText = getElement("swapIndex2").value.trim();
  const firstIndex = Number(firstText);
  const secondIndex = Number(secondText);

  if (
    firstText === "" ||
    secondText === "" ||
    !Number.isInteger(firstIndex) ||
    !Number.isInteger(secondIndex)
  ) {
    showResult("Hãy nhập đủ hai vị trí là số nguyên.", "error");
    return;
  }

  if (
    firstIndex < 0 ||
    secondIndex < 0 ||
    firstIndex >= integerArray.length ||
    secondIndex >= integerArray.length
  ) {
    showResult(
      `Vị trí phải nằm trong khoảng từ 0 đến ${integerArray.length - 1}.`,
      "error"
    );
    return;
  }

  swapArrayValues(firstIndex, secondIndex);
  renderIntegerArray();
  showResult(
    `Đã đổi chỗ vị trí ${firstIndex} và ${secondIndex}: [${integerArray.join(", ")}].`,
    "success"
  );
}

// Gọi hàm tương ứng với chức năng người dùng đã chọn.
function runSelectedFunction() {
  if (!hasSavedIntegerArray || integerArray.length === 0) {
    showResult("Bạn cần nhập và lưu mảng trước.", "error");
    return;
  }

  const selectedFunction = getElement("functionSelect").value;

  if (selectedFunction === "sumPositive") {
    showResult(`Tổng các số dương là ${calculatePositiveSum()}.`, "success");
  } else if (selectedFunction === "countPositive") {
    showResult(`Có ${countPositiveNumbers()} số dương.`, "success");
  } else if (selectedFunction === "minimum") {
    showResult(`Số nhỏ nhất là ${findMinimum()}.`, "success");
  } else if (selectedFunction === "minimumPositive") {
    const answer = findMinimumPositive();

    if (answer === null) {
      showResult("Mảng không có số dương.", "error");
    } else {
      showResult(`Số dương nhỏ nhất là ${answer}.`, "success");
    }
  } else if (selectedFunction === "lastEven") {
    showResult(`Số chẵn cuối cùng là ${findLastEvenNumber()}.`, "success");
  } else if (selectedFunction === "swap") {
    runSwapFunction();
  } else if (selectedFunction === "sort") {
    sortArrayAscending();
    renderIntegerArray();
    showResult(`Mảng sau khi sắp xếp: [${integerArray.join(", ")}].`, "success");
  } else if (selectedFunction === "firstPrime") {
    showResult(`Số nguyên tố đầu tiên là ${findFirstPrime()}.`, "success");
  } else if (selectedFunction === "countIntegersInFloat") {
    const result = countIntegersInFloatArray(getElement("floatInput").value);

    if (result.error !== "") {
      showResult(result.error, "error");
    } else {
      showResult(
        `Mảng số thực [${result.values.join(", ")}] có ${result.count} số nguyên.`,
        "success"
      );
    }
  } else if (selectedFunction === "compareSigns") {
    const result = comparePositiveAndNegative();
    showResult(
      `Số dương: ${result.positiveCount}. Số âm: ${result.negativeCount}. ${result.conclusion}`,
      "success"
    );
  }
}

// Gắn sự kiện cho các nút và ô nhập.
getElement("saveIntegerBtn").addEventListener("click", saveIntegerArray);
getElement("clearIntegerBtn").addEventListener("click", clearIntegerArray);
getElement("functionSelect").addEventListener("change", updateFunctionOptions);
getElement("runFunctionBtn").addEventListener("click", runSelectedFunction);

getElement("integerInput").addEventListener("keydown", function (event) {
  if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
    saveIntegerArray();
  }
});

// Khởi tạo giao diện ban đầu.
renderIntegerArray();
setFunctionControlsEnabled(false);
updateFunctionOptions();
showResult("Nhập và lưu mảng trước khi chọn chức năng.", "info");
