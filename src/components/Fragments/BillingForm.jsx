import React from "react";
import Input from "../Elements/Input";
import Checkbox from "../Elements/Checkbox";

function BillingForm({ form, onChange, saveInfo, onSaveInfo }) {
  return (
    <div className="flex-1 pr-8">
      <h2 className="text-2xl font-semibold mb-6">Billing Details</h2>
      <form>
        <Input
          name="firstName"
          placeholder="First Name*"
          value={form.firstName}
          onChange={onChange}
        />
        <Input
          name="company"
          placeholder="Company Name"
          value={form.company}
          onChange={onChange}
        />
        <Input
          name="address"
          placeholder="Street Address*"
          value={form.address}
          onChange={onChange}
        />
        <Input
          name="apartment"
          placeholder="Apartment, floor, etc. (optional)"
          value={form.apartment}
          onChange={onChange}
        />
        <Input
          name="city"
          placeholder="Town/City*"
          value={form.city}
          onChange={onChange}
        />
        <Input
          name="phone"
          placeholder="Phone Number*"
          value={form.phone}
          onChange={onChange}
        />
        <Input
          name="email"
          placeholder="Email Address*"
          value={form.email}
          onChange={onChange}
        />
        <Checkbox
          checked={saveInfo}
          onChange={onSaveInfo}
          label="Save this information for faster check-out next time"
        />
      </form>
    </div>
  );
}

export default BillingForm;
