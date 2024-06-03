import moment from "moment";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Search, Trash2 } from "lucide-react";
import { GiPayMoney, GiReceiveMoney } from "react-icons/gi";
import { FaBed } from "react-icons/fa6";
import CreateRecord from "./components/CreateRecord";
import { Button } from "@/components/ui/button";
import Header from "@/components/shared/Header";
import useData from "./data";
import EditRecord from "./components/EditRecord";
import React from "react";

const HomePage = () => {
  const {
    state,
    setSearch,
    setStartDate,
    setEndDate,
    setSortTime,
    fetchAllRecords,
    handleDeleteRecord,
    handleNextPage,
    handlePrevPage,
  } = useData();
  const {
    patientRecords,
    search,
    startDate,
    endDate,
    sortTime,
    recordInfo,
    page,
    maxPage,
  } = state;

  return (
    <div>
      <Header />
      <div className="container py-5">
        {/* cards of dashboard */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mb-10 mt-5">
          <div className="flex items-center gap-3 border border-gray-300 rounded-md shadow-sm p-5">
            <div className="bg-pink-600 rounded-md p-3">
              <GiReceiveMoney size={24} color="white" />
            </div>
            <div className="flex flex-col">
              <span
                style={{ fontWeight: "500" }}
                className="text-base sm:text-lg"
              >
                ₹{recordInfo?.totalEarnings}
              </span>
              <span className="text-sm sm:text-base text-muted-foreground">
                Total Earning
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3 border border-gray-300 rounded-md shadow-sm p-5">
            <div className="bg-red-600 rounded-md p-3">
              <GiPayMoney size={24} color="white" />
            </div>
            <div className="flex flex-col">
              <span
                style={{ fontWeight: "500" }}
                className="text-base sm:text-lg"
              >
                ₹{recordInfo?.totalDue}
              </span>
              <span className="text-sm sm:text-base text-muted-foreground">
                Total Amount Due
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3 border border-gray-300 rounded-md shadow-sm p-5">
            <div className="bg-yellow-500 rounded-md p-3">
              <FaBed size={24} color="white" />
            </div>
            <div className="flex flex-col">
              <span
                style={{ fontWeight: "500" }}
                className="text-base sm:text-lg"
              >
                {recordInfo?.totalPatients}
              </span>
              <span className="text-sm sm:text-base text-muted-foreground">
                Total Patients
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3 border border-gray-300 rounded-md shadow-sm p-5">
            <div className="bg-green-600 rounded-md p-3">
              <GiReceiveMoney size={24} color="white" />
            </div>
            <div className="flex flex-col">
              <span
                style={{ fontWeight: "500" }}
                className="text-base sm:text-lg"
              >
                ₹{recordInfo?.monthlyEarnings}
              </span>
              <span className="text-sm sm:text-base text-muted-foreground">
                Earning This Month
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3 border border-gray-300 rounded-md shadow-sm p-5">
            <div className="bg-blue-600 rounded-md p-3">
              <GiPayMoney size={24} color="white" />
            </div>
            <div className="flex flex-col">
              <span
                style={{ fontWeight: "500" }}
                className="text-base sm:text-lg"
              >
                ₹{recordInfo?.monthlyDue}
              </span>
              <span className="text-sm sm:text-base text-muted-foreground">
                Amount Due This Month
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3 border border-gray-300 rounded-md shadow-sm p-5">
            <div className="bg-violet-600 rounded-md p-3">
              <FaBed size={24} color="white" />
            </div>
            <div className="flex flex-col">
              <span
                style={{ fontWeight: "500" }}
                className="text-base sm:text-lg"
              >
                {recordInfo?.monthlyPatients}
              </span>
              <span className="text-sm sm:text-base text-muted-foreground">
                Patients This Month
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-3 md:w-[510px] border border-gray-300 hover:ring-1 hover:ring-gray-100 px-3 rounded-md">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search by patient name, mobile number, barcode, doctor name, lab name"
                className="w-full py-[9px] border-none outline-none text-sm"
                value={search}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearch(e.target.value)
                }
              />
            </div>
            <div className="flex items-center gap-3">
              <input
                type="date"
                value={startDate}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setStartDate(e.target.value)
                }
                className="border border-gray-300 px-2 py-2 rounded-md text-sm"
              />
              <span className="text-sm">To</span>
              <input
                type="date"
                value={endDate}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEndDate(e.target.value)
                }
                className="border border-gray-300 px-2 py-2 rounded-md text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <CreateRecord fetchAllRecords={fetchAllRecords} />
            <Select
              value={sortTime}
              onValueChange={(value) => setSortTime(value)}
            >
              <SelectTrigger className="outline-none w-[130px]">
                <SelectValue placeholder="Sort by time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3-months">Last 3 months</SelectItem>
                <SelectItem value="6-months">Last 6 months</SelectItem>
                <SelectItem value="1-year">Last 1 year</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={fetchAllRecords} variant="outline">
              Apply
            </Button>
          </div>
        </div>
        <div className="space-y-4">
          <Table className="border border-gray-300/80">
            {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
            <TableHeader className="bg-primary-foreground">
              <TableRow>
                <TableHead>Patient Name </TableHead>
                <TableHead>Mobile Number</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Test Type</TableHead>
                <TableHead>Amount Paid</TableHead>
                <TableHead>Amount Due</TableHead>
                <TableHead>Doctor Name</TableHead>
                <TableHead>Lab Name</TableHead>
                <TableHead>Barcode No.</TableHead>
                <TableHead>Date of Visit</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patientRecords?.map((item) => {
                const dateOfVisit = moment(item?.dateOfVisit).format(
                  "DD-MM-YYYY"
                );
                return (
                  <TableRow key={item?._id}>
                    <TableCell className="font-medium">
                      {item?.patientName}
                    </TableCell>
                    <TableCell>{item?.mobileNumber}</TableCell>
                    <TableCell>{item?.age}</TableCell>
                    <TableCell>{item?.gender}</TableCell>
                    <TableCell>{item?.testType}</TableCell>
                    <TableCell className="text-green-600">
                      ₹{item?.amountPaid}
                    </TableCell>
                    <TableCell className="text-red-600">
                      ₹{item?.amountDue}
                    </TableCell>
                    <TableCell>{item?.doctorName}</TableCell>
                    <TableCell>{item?.labName}</TableCell>
                    <TableCell>{item?.barcodeNumber}</TableCell>
                    <TableCell>{dateOfVisit}</TableCell>
                    <TableCell className="flex items-center gap-3">
                      <EditRecord
                        patientRecord={item}
                        fetchAllRecords={fetchAllRecords}
                      />
                      <button
                        onClick={() => handleDeleteRecord(item?._id)}
                        className="text-red-600"
                      >
                        <Trash2 size={18} />
                      </button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {/* pagination button */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Showing {patientRecords?.length} of {recordInfo?.totalRecords}{" "}
              results at page {recordInfo?.currentPage}
            </span>
            <div className="flex items-center gap-4">
              <Button
                disabled={page === 1}
                onClick={handlePrevPage}
                variant="outline"
              >
                Previous
              </Button>
              <Button
                disabled={page === maxPage}
                onClick={handleNextPage}
                variant="outline"
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
