import axios from "axios";
import React from "react";
import toast from "react-hot-toast";

interface PatientRecord {
  _id: string;
  userId: string;
  patientName: string;
  mobileNumber: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  doctorName: string;
  labName: string;
  testType: string;
  barcodeNumber: string;
  amountPaid: number;
  amountDue: number;
  dateOfVisit: Date;
  dateOfReport: Date;
}

interface IState {
  patientRecords: PatientRecord[];
  search: string;
  startDate: string;
  endDate: string;
  sortTime: string;
  page: number;
}
const useData = () => {
  const [patientRecords, setPatientRecords] = React.useState<
    IState["patientRecords"]
  >([]);

  const [search, setSearch] = React.useState<IState["search"]>("");
  const [startDate, setStartDate] = React.useState<IState["startDate"]>("");
  const [endDate, setEndDate] = React.useState<IState["endDate"]>("");
  const [sortTime, setSortTime] = React.useState<IState["sortTime"]>("");

  const [recordInfo, setRecordInfo] = React.useState<any>(null);
  const [page, setPage] = React.useState<number>(1);
  const [maxPage, setMaxPage] = React.useState<number>(1);

  const handleNextPage = () => {
    if (page < maxPage) {
      setPage(page + 1);
    }
  };
  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const fetchAllRecords = async () => {
    try {
      // Construct query parameters
      let queryParams = `?search=${search}`;
      if (startDate) {
        queryParams += `&startDate=${startDate}`;
      }
      if (endDate) {
        queryParams += `&endDate=${endDate}`;
      }

      if (sortTime) {
        queryParams += `&sortTime=${sortTime}`;
      }

      if (page) {
        queryParams += `&page=${page}`;
      }

      // Make API call with query parameters
      const { data } = await axios.get(`/api/patientRecords${queryParams}`);
      if (data && data?.success) {
        setPatientRecords(data.data);
        setRecordInfo(data);
        setMaxPage(data?.totalPages);
      }
    } catch (error: any) {
      if (error && error.response) {
        toast.error(error.response.data.message);
      }
      console.log("Error: ", error.message);
    }
  };
  const handleDeleteRecord = async (recordId: string) => {
    try {
      const { data } = await axios.delete(
        `/api/patientRecords/delete/${recordId}`
      );
      if (data && data?.success) {
        toast.success(data?.message);
        await fetchAllRecords();
      }
    } catch (error: any) {
      if (error && error?.response) {
        toast.error(error?.response?.data?.message);
      }
      console.log("Error : ", error?.message);
    }
  };

  React.useEffect(() => {
    fetchAllRecords();
  }, [search, page]);

  const state = {
    patientRecords,
    search,
    startDate,
    endDate,
    sortTime,
    recordInfo,
    page,
    maxPage,
  };
  return {
    state,
    setPatientRecords,
    setSearch,
    setStartDate,
    setEndDate,
    setSortTime,
    fetchAllRecords,
    handleDeleteRecord,
    handleNextPage,
    handlePrevPage,
  };
};

export default useData;
