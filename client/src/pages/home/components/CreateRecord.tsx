import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";
import toast from "react-hot-toast";
import axios from "axios";

interface IProps {
  fetchAllRecords: () => void;
}

const formSchema = z.object({
  patientName: z.string().min(3, {
    message: "Patient name must be at least 3 characters.",
  }),
  mobileNumber: z.string().regex(/^\d{10}$/, {
    message: "Mobile number must be exactly 10 digits.",
  }),
  age: z.preprocess(
    (val) => Number(val),
    z.number().positive({
      message: "Age must be a valid positive number.",
    })
  ),
  gender: z.enum(["Male", "Female", "Other"], {
    message: "Gender must be specified.",
  }),
  doctorName: z.string().min(3, {
    message: "Doctor name must be at least 3 characters.",
  }),
  labName: z.string().min(3, {
    message: "Lab name must be at least 3 characters.",
  }),
  testType: z.string().min(1, {
    message: "Test type must be specified.",
  }),
  barcodeNumber: z.string().min(1, {
    message: "Barcode number must be specified.",
  }),
  amountPaid: z.preprocess(
    (val) => Number(val),
    z.number().nonnegative({
      message: "Amount paid must be a valid non-negative number.",
    })
  ),
  amountDue: z.preprocess(
    (val) => Number(val),
    z.number().nonnegative({
      message: "Amount due must be a valid non-negative number.",
    })
  ),
  dateOfVisit: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Date of visit must be a valid date.",
  }),
  dateOfReport: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Date of report must be a valid date.",
  }),
});

const CreateRecord: React.FC<IProps> = ({ fetchAllRecords }) => {
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientName: "",
      mobileNumber: "",
      age: 0,
      gender: "Male",
      doctorName: "",
      labName: "",
      testType: "",
      barcodeNumber: "",
      amountPaid: 0,
      amountDue: 0,
      dateOfVisit: "",
      dateOfReport: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      const { data } = await axios.post("/api/patientRecords/create", values);
      if (data && data?.success) {
        await fetchAllRecords();
        toast.success(data?.message);
        setIsModalOpen(false);
      }
    } catch (error: any) {
      if (error && error?.response) {
        toast.error(error?.response?.data?.message);
      }
      console.log("Error : ", error?.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog
      open={isModalOpen}
      onOpenChange={() => setIsModalOpen(!isModalOpen)}
    >
      <DialogTrigger onClick={() => setIsModalOpen(true)} asChild>
        <Button className="space-x-2">
          <Plus size={18} />
          <span className="text-sm tracking-wider">Create</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full sm:max-w-6xl h-full sm:max-h-[90vh] overflow-y-auto flex flex-col justify-between">
        <DialogHeader>
          <DialogTitle className="text-start">Create New Record</DialogTitle>
          <DialogDescription className="text-start">
            Fill out the form below to create a new patient record.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5 w-full h-full flex flex-col justify-between"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 w-full">
              <FormField
                control={form.control}
                name="patientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-normal">Patient Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage className="font-normal" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="mobileNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-normal">Mobile Number</FormLabel>
                    <FormControl>
                      <Input placeholder="1234567890" {...field} />
                    </FormControl>
                    <FormMessage className="font-normal" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-normal">Age</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="25" {...field} />
                    </FormControl>
                    <FormMessage className="font-normal" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-normal">Gender</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage className="font-normal" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="doctorName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-normal">Doctor Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Dr. Smith" {...field} />
                    </FormControl>
                    <FormMessage className="font-normal" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="labName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-normal">Lab Name</FormLabel>
                    <FormControl>
                      <Input placeholder="ABC Lab" {...field} />
                    </FormControl>
                    <FormMessage className="font-normal" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="testType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-normal">Test Type</FormLabel>
                    <FormControl>
                      <Input placeholder="Blood" {...field} />
                    </FormControl>
                    <FormMessage className="font-normal" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="barcodeNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-normal">
                      Barcode Number
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="123456" {...field} />
                    </FormControl>
                    <FormMessage className="font-normal" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amountPaid"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-normal">Amount Paid</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="250.00"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="font-normal" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amountDue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-normal">Amount Due</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="50.00"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="font-normal" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dateOfVisit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-normal">Date of Visit</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage className="font-normal" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dateOfReport"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-normal">
                      Date of Report
                    </FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage className="font-normal" />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="flex flex-row justify-end gap-3 py-4">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">
                {loading ? "Please wait.." : "Submit"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateRecord;
