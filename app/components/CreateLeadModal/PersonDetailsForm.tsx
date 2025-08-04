import {
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  SimpleGrid,
  Select,
} from "@chakra-ui/react";
import React from "react";

function calculateAge(dob: string): number {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

interface PersonDetailsFormProps {
  formData: {
    first_name: string;
    last_name: string;
    middle_initial: string;
    gender: string;
    tobacco_use: string;
    phone1: string;
    phone2: string;
    email_address: string;
    dob: string;
    age: number | "";
    spouse_name: string;
    spouse_age: number | "";
  };
  handleInputChange: (
    field: string,
  ) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => void;
}

const PersonDetailsForm: React.FC<PersonDetailsFormProps> = (
  { formData, handleInputChange },
) => (
  <SimpleGrid columns={2} spacing={4}>
    <FormControl>
      <FormLabel htmlFor="first_name">First Name</FormLabel>
      <Input
        id="first_name"
        value={formData.first_name}
        onChange={handleInputChange("first_name")}
      />
    </FormControl>
    <FormControl>
      <FormLabel htmlFor="last_name">Last Name</FormLabel>
      <Input
        id="last_name"
        value={formData.last_name}
        onChange={handleInputChange("last_name")}
      />
    </FormControl>
    <FormControl>
      <FormLabel htmlFor="middle_initial">Middle Initial</FormLabel>
      <Input
        id="middle_initial"
        value={formData.middle_initial}
        onChange={handleInputChange("middle_initial")}
      />
    </FormControl>
    <FormControl>
      <FormLabel htmlFor="gender">Gender</FormLabel>
      <Select
        id="gender"
        value={formData.gender}
        onChange={handleInputChange("gender")}
      >
        <option value="Male">Male</option>
        <option value="Female">Female</option>
      </Select>
    </FormControl>
    <FormControl>
      <FormLabel htmlFor="tobacco_use">Tobacco Use</FormLabel>
      <Select
        id="tobacco_use"
        value={formData.tobacco_use || "Unknown"}
        onChange={handleInputChange("tobacco_use")}
      >
        <option value="Smoker">Smoker</option>
        <option value="Non Smoker">Non Smoker</option>
        <option value="Cigar Only">Cigar Only</option>
        <option value="Chewer/Dipper">Chewer/Dipper</option>
        <option value="E-Cig Only">E-Cig Only</option>
        <option value="Unknown">Unknown</option>
      </Select>
    </FormControl>
    <FormControl>
      <FormLabel htmlFor="phone1">Phone 1</FormLabel>
      <Input
        id="phone1"
        value={formData.phone1}
        onChange={handleInputChange("phone1")}
      />
    </FormControl>
    <FormControl>
      <FormLabel htmlFor="phone2">Phone 2</FormLabel>
      <Input
        id="phone2"
        value={formData.phone2}
        onChange={handleInputChange("phone2")}
      />
    </FormControl>
    <FormControl>
      <FormLabel htmlFor="email_address">Email Address</FormLabel>
      <Input
        id="email_address"
        value={formData.email_address}
        onChange={handleInputChange("email_address")}
      />
    </FormControl>
    <FormControl>
      <FormLabel htmlFor="dob">Date of Birth</FormLabel>
      <Input
        id="dob"
        type="date"
        value={formData.dob}
        onChange={handleInputChange("dob")}
      />
    </FormControl>
    <FormControl>
      <FormLabel htmlFor="age">Age</FormLabel>
      <NumberInput min={0}>
        <NumberInputField
          id="age"
          value={formData.age || ""}
          onChange={handleInputChange("age")}
          isReadOnly
        />
      </NumberInput>
    </FormControl>
    <FormControl>
      <FormLabel htmlFor="spouse_name">Spouse Name</FormLabel>
      <Input
        id="spouse_name"
        value={formData.spouse_name}
        onChange={handleInputChange("spouse_name")}
      />
    </FormControl>
    <FormControl>
      <FormLabel htmlFor="spouse_age">Spouse Age</FormLabel>
      <NumberInput min={0}>
        <NumberInputField
          id="spouse_age"
          value={formData.spouse_age || ""}
          onChange={handleInputChange("spouse_age")}
        />
      </NumberInput>
    </FormControl>
  </SimpleGrid>
);

export default PersonDetailsForm;