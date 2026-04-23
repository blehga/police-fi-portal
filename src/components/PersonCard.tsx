"use client";

import { useMemo, useState } from "react";

export type PersonInput = {
  firstName: string;
  middleName: string;
  lastName: string;
  nickname: string;
  dob: string;
  age: string;
  sex: string;
  race: string;

  role: string;
  movementType: string;
  isPrimary: boolean;

  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;

  primaryLanguage: string;
  description: string;

  height: string;
  weight: string;
  build: string;
  hairColor: string;
  hairLength: string;
  hairStyle: string;
  eyeColor: string;
  complexion: string;
  teeth: string;
  handPreference: string;

  tattoos: string;
  scars: string;
  needleMarks: string;
  tracks: string;
  glasses: string;
  mustache: string;
  beard: string;

  socialSecurity: string;
  driverLicense: string;
  driverLicenseState: string;
  otherId: string;
  otherIdType: string;
  otherIdState: string;

  school: string;
  schoolAddress: string;
  schoolCity: string;
  schoolState: string;
  schoolZip: string;
  schoolPhone: string;

  parentName: string;
  parentAddress: string;
  parentCity: string;
  parentState: string;
  parentZip: string;
  parentPhone: string;

  occupation: string;
  employerName: string;
  employerAddress: string;
  employerCity: string;
  employerState: string;
  employerZip: string;
  employerPhone: string;

  gangName: string;
  gangMembershipLength: string;

  onParole: boolean;
  paroleOfficer: string;
  parolePhone: string;
  onProbation: boolean;
  probationOfficer: string;
  probationPhone: string;

  vehicleLicense: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleStyle: string;
  vehicleYear: string;
  vehicleColor: string;
  vehicleState: string;
  vehicleOddities: string;

  comments: string;
};

type Props = {
  person: PersonInput;
  index: number;
  subjectType?: string;
  readOnlyMode?: boolean;
  onChange: (index: number, updated: PersonInput) => void;
  onRemove: (index: number) => void;
};

type TabKey =
  | "subject"
  | "identifiers"
  | "idinfo"
  | "school"
  | "parent"
  | "employer"
  | "gang"
  | "parole"
  | "vehicle"
  | "comments";

const tabs: Array<{ key: TabKey; label: string }> = [
  { key: "subject", label: "Subject" },
  { key: "identifiers", label: "Identifiers" },
  { key: "idinfo", label: "ID Info" },
  { key: "school", label: "School" },
  { key: "parent", label: "Parent" },
  { key: "employer", label: "Employer" },
  { key: "gang", label: "Gang" },
  { key: "parole", label: "Parole/Probation" },
  { key: "vehicle", label: "Vehicle" },
  { key: "comments", label: "Comments" },
];

const inputClass =
  "w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200";

const readOnlyClass =
  "w-full rounded-xl border border-slate-200 bg-slate-100 px-3.5 py-2.5 text-sm text-slate-500 outline-none cursor-not-allowed";

const labelClass = "mb-1.5 block text-xs font-medium text-slate-500";
const sectionTitleClass = "mb-3 text-sm font-semibold text-slate-800";
const sectionCardClass = "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm";

const onlyDigits = (value: string) => value.replace(/\D/g, "");

const calculateAge = (dob: string) => {
  if (!dob) return "";

  const birthDate = new Date(`${dob}T00:00:00`);
  if (Number.isNaN(birthDate.getTime())) return "";

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age -= 1;
  }

  return age >= 0 ? String(age) : "";
};

const formatPhone = (value: string) => {
  const digits = onlyDigits(value).slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
};

const formatSSN = (value: string) => {
  const digits = onlyDigits(value).slice(0, 9);
  if (digits.length <= 3) return digits;
  if (digits.length <= 5) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5)}`;
};

const formatDriversLicense = (value: string) =>
  value.toUpperCase().replace(/[^A-Z0-9-]/g, "").slice(0, 20);

export default function PersonCard({
  person,
  index,
  subjectType,
  readOnlyMode = false,
  onChange,
  onRemove,
}: Props) {
  const [activeTab, setActiveTab] = useState<TabKey>("subject");

  const safePerson = useMemo<PersonInput>(
    () => ({
      firstName: person?.firstName ?? "",
      middleName: person?.middleName ?? "",
      lastName: person?.lastName ?? "",
      nickname: person?.nickname ?? "",
      dob: person?.dob ?? "",
      age: person?.age ?? "",
      sex: person?.sex ?? "",
      race: person?.race ?? "",

      role: person?.role ?? "Subject",
      movementType: person?.movementType ?? "",
      isPrimary: Boolean(person?.isPrimary),

      address: person?.address ?? "",
      city: person?.city ?? "",
      state: person?.state ?? "",
      zip: person?.zip ?? "",
      phone: person?.phone ?? "",
      email: person?.email ?? "",

      primaryLanguage: person?.primaryLanguage ?? "",
      description: person?.description ?? "",

      height: person?.height ?? "",
      weight: person?.weight ?? "",
      build: person?.build ?? "",
      hairColor: person?.hairColor ?? "",
      hairLength: person?.hairLength ?? "",
      hairStyle: person?.hairStyle ?? "",
      eyeColor: person?.eyeColor ?? "",
      complexion: person?.complexion ?? "",
      teeth: person?.teeth ?? "",
      handPreference: person?.handPreference ?? "",

      tattoos: person?.tattoos ?? "",
      scars: person?.scars ?? "",
      needleMarks: person?.needleMarks ?? "",
      tracks: person?.tracks ?? "",
      glasses: person?.glasses ?? "",
      mustache: person?.mustache ?? "",
      beard: person?.beard ?? "",

      socialSecurity: person?.socialSecurity ?? "",
      driverLicense: person?.driverLicense ?? "",
      driverLicenseState: person?.driverLicenseState ?? "",
      otherId: person?.otherId ?? "",
      otherIdType: person?.otherIdType ?? "",
      otherIdState: person?.otherIdState ?? "",

      school: person?.school ?? "",
      schoolAddress: person?.schoolAddress ?? "",
      schoolCity: person?.schoolCity ?? "",
      schoolState: person?.schoolState ?? "",
      schoolZip: person?.schoolZip ?? "",
      schoolPhone: person?.schoolPhone ?? "",

      parentName: person?.parentName ?? "",
      parentAddress: person?.parentAddress ?? "",
      parentCity: person?.parentCity ?? "",
      parentState: person?.parentState ?? "",
      parentZip: person?.parentZip ?? "",
      parentPhone: person?.parentPhone ?? "",

      occupation: person?.occupation ?? "",
      employerName: person?.employerName ?? "",
      employerAddress: person?.employerAddress ?? "",
      employerCity: person?.employerCity ?? "",
      employerState: person?.employerState ?? "",
      employerZip: person?.employerZip ?? "",
      employerPhone: person?.employerPhone ?? "",

      gangName: person?.gangName ?? "",
      gangMembershipLength: person?.gangMembershipLength ?? "",

      onParole: Boolean(person?.onParole),
      paroleOfficer: person?.paroleOfficer ?? "",
      parolePhone: person?.parolePhone ?? "",
      onProbation: Boolean(person?.onProbation),
      probationOfficer: person?.probationOfficer ?? "",
      probationPhone: person?.probationPhone ?? "",

      vehicleLicense: person?.vehicleLicense ?? "",
      vehicleMake: person?.vehicleMake ?? "",
      vehicleModel: person?.vehicleModel ?? "",
      vehicleStyle: person?.vehicleStyle ?? "",
      vehicleYear: person?.vehicleYear ?? "",
      vehicleColor: person?.vehicleColor ?? "",
      vehicleState: person?.vehicleState ?? "",
      vehicleOddities: person?.vehicleOddities ?? "",

      comments: person?.comments ?? "",
    }),
    [person]
  );

  const update = <K extends keyof PersonInput>(key: K, value: PersonInput[K]) => {
    onChange(index, { ...safePerson, [key]: value });
  };

  const updateMany = (updates: Partial<PersonInput>) => {
    onChange(index, { ...safePerson, ...updates });
  };

  const displayName = useMemo(() => {
    const name = [safePerson.firstName, safePerson.middleName, safePerson.lastName]
      .filter(Boolean)
      .join(" ")
      .trim();

    return name || "New Person";
  }, [safePerson.firstName, safePerson.middleName, safePerson.lastName]);


  const tabHasData = (tab: TabKey) => {
    switch (tab) {
      case "subject":
        return Boolean(
          safePerson.race ||
            safePerson.primaryLanguage ||
            safePerson.height ||
            safePerson.weight ||
            safePerson.build ||
            safePerson.eyeColor ||
            safePerson.hairColor ||
            safePerson.hairLength ||
            safePerson.hairStyle ||
            safePerson.complexion ||
            safePerson.teeth ||
            safePerson.handPreference ||
            safePerson.phone ||
            safePerson.email ||
            safePerson.address ||
            safePerson.city ||
            safePerson.state ||
            safePerson.zip
        );
      case "identifiers":
        return Boolean(
          safePerson.tattoos ||
            safePerson.scars ||
            safePerson.needleMarks ||
            safePerson.tracks ||
            safePerson.glasses ||
            safePerson.mustache ||
            safePerson.beard
        );
      case "idinfo":
        return Boolean(
          safePerson.socialSecurity ||
            safePerson.driverLicense ||
            safePerson.driverLicenseState ||
            safePerson.otherId ||
            safePerson.otherIdType ||
            safePerson.otherIdState
        );
      case "school":
        return Boolean(
          safePerson.school ||
            safePerson.schoolAddress ||
            safePerson.schoolCity ||
            safePerson.schoolState ||
            safePerson.schoolZip ||
            safePerson.schoolPhone
        );
      case "parent":
        return Boolean(
          safePerson.parentName ||
            safePerson.parentAddress ||
            safePerson.parentCity ||
            safePerson.parentState ||
            safePerson.parentZip ||
            safePerson.parentPhone
        );
      case "employer":
        return Boolean(
          safePerson.occupation ||
            safePerson.employerName ||
            safePerson.employerAddress ||
            safePerson.employerCity ||
            safePerson.employerState ||
            safePerson.employerZip ||
            safePerson.employerPhone
        );
      case "gang":
        return Boolean(safePerson.gangName || safePerson.gangMembershipLength);
      case "parole":
        return Boolean(
          safePerson.onParole ||
            safePerson.paroleOfficer ||
            safePerson.parolePhone ||
            safePerson.onProbation ||
            safePerson.probationOfficer ||
            safePerson.probationPhone
        );
      case "vehicle":
        return Boolean(
          safePerson.vehicleLicense ||
            safePerson.vehicleMake ||
            safePerson.vehicleModel ||
            safePerson.vehicleStyle ||
            safePerson.vehicleYear ||
            safePerson.vehicleColor ||
            safePerson.vehicleState ||
            safePerson.vehicleOddities
        );
      case "comments":
        return Boolean(safePerson.comments);
      default:
        return false;
    }
  };

  const renderTextField = (
    key: keyof PersonInput,
    label: string,
    placeholder = "",
    type: "text" | "email" = "text"
  ) => (
    <div>
      <label className={labelClass}>{label}</label>
      <input
        type={type}
        value={String(safePerson[key] ?? "")}
        onChange={(e) => update(key, e.target.value as PersonInput[keyof PersonInput])}
        placeholder={placeholder || label}
        readOnly={readOnlyMode}
            className={inputClass}
      />
    </div>
  );

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-xl font-semibold text-slate-900">{displayName}</h3>
            {safePerson.isPrimary && (
              <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-200">
                Primary Person
              </span>
            )}
          </div>

  <div className="mt-1 text-sm text-slate-500">
  {subjectType || "Subject"}
</div>
        </div>

      {!readOnlyMode && (
      <button
  type="button"
  onClick={() => onRemove(index)}
  className="shrink-0 inline-flex items-center justify-center rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100"
>
  Remove
</button>
      )}
      </div>

      <div className="mt-1 flex flex-wrap gap-1.5">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          const hasData = tabHasData(tab.key);

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
 className={
  isActive
    ? "inline-flex items-center gap-2 rounded-full bg-blue-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm"
    : "inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-200"
}
            >
              <span>{tab.label}</span>
              {hasData && (
                <span
                  className={
                    isActive
                      ? "h-2 w-2 rounded-full bg-white/90"
                      : "h-2 w-2 rounded-full bg-blue-500"
                  }
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-5 mb-3 text-sm font-semibold text-slate-800">
        Quick Info
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
        <div>
          <label className={labelClass}>First Name</label>
          <input
            value={safePerson.firstName}
            onChange={(e) => update("firstName", e.target.value)}
            placeholder="First Name"
            readOnly={readOnlyMode}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Middle Name</label>
          <input
            value={safePerson.middleName}
            onChange={(e) => update("middleName", e.target.value)}
            placeholder="Middle Name"
            readOnly={readOnlyMode}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Last Name</label>
          <input
            value={safePerson.lastName}
            onChange={(e) => update("lastName", e.target.value)}
            placeholder="Last Name"
            readOnly={readOnlyMode}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Nickname</label>
          <input
            value={safePerson.nickname}
            onChange={(e) => update("nickname", e.target.value)}
            placeholder="Nickname"
            readOnly={readOnlyMode}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Sex</label>
          <select
            disabled={readOnlyMode}
            value={safePerson.sex}
            onChange={(e) => update("sex", e.target.value)}
            className={inputClass}
          >
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className={labelClass}>DOB</label>
          <input
            type="date"
            value={safePerson.dob}
            onChange={(e) => {
              const dob = e.target.value;
              updateMany({
                dob,
                age: calculateAge(dob),
              });
            }}
            readOnly={readOnlyMode}
            className={inputClass}
          />
        </div>

          <div>
          <label className={labelClass}>Age</label>
          <input value={safePerson.age} readOnly className={readOnlyClass}   disabled={readOnlyMode}
            />
        </div>


        <div className="flex items-end">
          <label className="flex w-full items-center gap-2 rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-700">
            <input
              type="checkbox"
              checked={safePerson.isPrimary}
              onChange={(e) => update("isPrimary", e.target.checked)}
              disabled={readOnlyMode}
            />
            Primary Person
          </label>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 md:p-5">
        {activeTab === "subject" && (
          <div className="space-y-6">
            <section className={sectionCardClass}>
              <div className={sectionTitleClass}>Demographics</div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
                <div>
                  <label className={labelClass}>Race</label>
                  <select
            disabled={readOnlyMode}
                    value={safePerson.race}
                    onChange={(e) => update("race", e.target.value)}
                    className={inputClass}
                  >
                    <option value="">Select</option>
                    <option value="American Indian or Alaska Native">
                      American Indian or Alaska Native
                    </option>
                    <option value="Asian">Asian</option>
                    <option value="Black or African American">
                      Black or African American
                    </option>
                    <option value="Hispanic or Latino">Hispanic or Latino</option>
                    <option value="Native Hawaiian or Other Pacific Islander">
                      Native Hawaiian or Other Pacific Islander
                    </option>
                    <option value="White">White</option>
                    <option value="Other">Other</option>
                    <option value="Unknown">Unknown</option>
                  </select>
                </div>

                {renderTextField("primaryLanguage", "Primary Language")}
              </div>
            </section>

            <section className={sectionCardClass}>
              <div className={sectionTitleClass}>Subject Info</div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
                <div className="xl:col-span-2">
                  <label className={labelClass}>Street Address</label>
                  <input
                    value={safePerson.address}
                    onChange={(e) => update("address", e.target.value)}
                    placeholder="Street Address"
                    className={inputClass}
                    disabled={readOnlyMode}
            />
                </div>

                {renderTextField("city", "City")}
                {renderTextField("state", "State")}
                {renderTextField("zip", "Zip")}

                <div>
                  <label className={labelClass}>Subject Telephone</label>
                  <input
                    value={safePerson.phone}
                    onChange={(e) => update("phone", formatPhone(e.target.value))}
                    placeholder="123-456-7890"
                    readOnly={readOnlyMode}
            className={inputClass}
                    inputMode="numeric"
                  />
                </div>

                <div className="xl:col-span-2">
                  <label className={labelClass}>Subject Email</label>
                  <input
                    type="email"
                    value={safePerson.email}
                    onChange={(e) => update("email", e.target.value)}
                    placeholder="Subject Email"
                    readOnly={readOnlyMode}
            className={inputClass}
                  />
                </div>
              </div>
            </section>

            <section className={sectionCardClass}>
              <div className={sectionTitleClass}>Physical Description</div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
                {renderTextField("height", "Height")}
                {renderTextField("weight", "Weight")}
                {renderTextField("build", "Build")}
                {renderTextField("eyeColor", "Eye Color")}
                {renderTextField("hairColor", "Hair Color")}
                {renderTextField("hairLength", "Hair Length")}
                {renderTextField("hairStyle", "Hair Style")}
                {renderTextField("complexion", "Complexion")}
                {renderTextField("teeth", "Teeth")}
                {renderTextField("handPreference", "Hand Preference")}
              </div>
            </section>
          </div>
        )}

        {activeTab === "identifiers" && (
          <section className={sectionCardClass}>
            <div className={sectionTitleClass}>Identifiers</div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              {renderTextField("tattoos", "Tattoos")}
              {renderTextField("scars", "Scars")}
              {renderTextField("needleMarks", "Needle Marks")}
              {renderTextField("tracks", "Tracks")}
              {renderTextField("glasses", "Glasses")}
              {renderTextField("mustache", "Mustache")}
              {renderTextField("beard", "Beard")}
            </div>
          </section>
        )}

        {activeTab === "idinfo" && (
          <section className={sectionCardClass}>
            <div className={sectionTitleClass}>ID Information</div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              <div>
                <label className={labelClass}>Social Security</label>
                <input
                  value={safePerson.socialSecurity}
                  onChange={(e) => update("socialSecurity", formatSSN(e.target.value))}
                  placeholder="123-45-6789"
                  readOnly={readOnlyMode}
            className={inputClass}
                  inputMode="numeric"
                />
              </div>

              <div>
                <label className={labelClass}>Driver's License</label>
                <input
                  value={safePerson.driverLicense}
                  onChange={(e) =>
                    update("driverLicense", formatDriversLicense(e.target.value))
                  }
                  placeholder="Driver's License"
                  readOnly={readOnlyMode}
            className={inputClass}
                />
              </div>

              {renderTextField("driverLicenseState", "DL State")}
              {renderTextField("otherId", "Other ID Number")}
              {renderTextField("otherIdType", "ID Type")}
              {renderTextField("otherIdState", "State / Country")}
            </div>
          </section>
        )}

        {activeTab === "school" && (
          <section className={sectionCardClass}>
            <div className={sectionTitleClass}>School Information</div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
              {renderTextField("school", "School Name")}

              <div>
                <label className={labelClass}>School Telephone</label>
                <input
                  value={safePerson.schoolPhone}
                  onChange={(e) => update("schoolPhone", formatPhone(e.target.value))}
                  placeholder="123-456-7890"
                  readOnly={readOnlyMode}
            className={inputClass}
                  inputMode="numeric"
                />
              </div>

              <div className="xl:col-span-2">
                <label className={labelClass}>School Address</label>
                <input
                  value={safePerson.schoolAddress}
                  onChange={(e) => update("schoolAddress", e.target.value)}
                  placeholder="School Address"
                  readOnly={readOnlyMode}
            className={inputClass}
                />
              </div>

              {renderTextField("schoolCity", "City")}
              {renderTextField("schoolState", "State")}
              {renderTextField("schoolZip", "Zip")}
            </div>
          </section>
        )}

        {activeTab === "parent" && (
          <section className={sectionCardClass}>
            <div className={sectionTitleClass}>Parent Information</div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
              {renderTextField("parentName", "Parent Name")}

              <div>
                <label className={labelClass}>Parent Telephone</label>
                <input
                  value={safePerson.parentPhone}
                  onChange={(e) => update("parentPhone", formatPhone(e.target.value))}
                  placeholder="123-456-7890"
                  readOnly={readOnlyMode}
            className={inputClass}
                  inputMode="numeric"
                />
              </div>

              <div className="xl:col-span-2">
                <label className={labelClass}>Parent Address</label>
                <input
                  value={safePerson.parentAddress}
                  onChange={(e) => update("parentAddress", e.target.value)}
                  placeholder="Parent Address"
                  readOnly={readOnlyMode}
            className={inputClass}
                />
              </div>

              {renderTextField("parentCity", "City")}
              {renderTextField("parentState", "State")}
              {renderTextField("parentZip", "Zip")}
            </div>
          </section>
        )}

        {activeTab === "employer" && (
          <section className={sectionCardClass}>
            <div className={sectionTitleClass}>Employer Information</div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
              {renderTextField("occupation", "Subject Occupation")}
              {renderTextField("employerName", "Employer Name")}

              <div>
                <label className={labelClass}>Employer Telephone</label>
                <input
                  value={safePerson.employerPhone}
                  onChange={(e) => update("employerPhone", formatPhone(e.target.value))}
                  placeholder="123-456-7890"
                  readOnly={readOnlyMode}
            className={inputClass}
                  inputMode="numeric"
                />
              </div>

              <div className="xl:col-span-2">
                <label className={labelClass}>Employer Address</label>
                <input
                  value={safePerson.employerAddress}
                  onChange={(e) => update("employerAddress", e.target.value)}
                  placeholder="Employer Address"
                  readOnly={readOnlyMode}
            className={inputClass}
                />
              </div>

              {renderTextField("employerCity", "City")}
              {renderTextField("employerState", "State")}
              {renderTextField("employerZip", "Zip")}
            </div>
          </section>
        )}

        {activeTab === "gang" && (
          <section className={sectionCardClass}>
            <div className={sectionTitleClass}>Gang Information</div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              {renderTextField("gangName", "Gang Name")}
              {renderTextField("gangMembershipLength", "Gang Membership Length")}
            </div>
          </section>
        )}

        {activeTab === "parole" && (
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <section className={sectionCardClass}>
              <div className={sectionTitleClass}>Parole</div>
              <label className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={safePerson.onParole}
                  onChange={(e) => update("onParole", e.target.checked)}
                  disabled={readOnlyMode}
            />
                On Parole
              </label>
              <div className="grid grid-cols-1 gap-3">
                {renderTextField("paroleOfficer", "Parole Officer Name")}
                <div>
                  <label className={labelClass}>Parole Officer Phone</label>
                  <input
                    value={safePerson.parolePhone}
                    onChange={(e) => update("parolePhone", formatPhone(e.target.value))}
                    placeholder="123-456-7890"
                    className={inputClass}
                    inputMode="numeric"
                    disabled={readOnlyMode}
            />
                </div>
              </div>
            </section>

            <section className={sectionCardClass}>
              <div className={sectionTitleClass}>Probation</div>
              <label className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={safePerson.onProbation}
                  onChange={(e) => update("onProbation", e.target.checked)}
                  disabled={readOnlyMode}
            />
                On Probation
              </label>
              <div className="grid grid-cols-1 gap-3">
                {renderTextField("probationOfficer", "Probation Officer Name")}
                <div>
                  <label className={labelClass}>Probation Officer Phone</label>
                  <input
                    value={safePerson.probationPhone}
                    onChange={(e) =>
                      update("probationPhone", formatPhone(e.target.value))
                    }
                    placeholder="123-456-7890"
                    className={inputClass}
                    inputMode="numeric"
                    disabled={readOnlyMode}
            />
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === "vehicle" && (
          <section className={sectionCardClass}>
            <div className={sectionTitleClass}>Vehicle Information</div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
              {renderTextField("vehicleLicense", "Veh. License")}
              {renderTextField("vehicleMake", "Veh. Make")}
              {renderTextField("vehicleModel", "Veh. Model")}
              {renderTextField("vehicleStyle", "Body Style")}
              {renderTextField("vehicleYear", "Veh. Year")}
              {renderTextField("vehicleColor", "Veh. Colors")}
              {renderTextField("vehicleState", "Veh. State")}
              {renderTextField("vehicleOddities", "Vehicle Oddities")}
            </div>
          </section>
        )}

        {activeTab === "comments" && (
          <section className={sectionCardClass}>
            <div className={sectionTitleClass}>
              Other Information / Comments / Clothes etc.
            </div>
            <textarea
              readOnly={readOnlyMode}
              rows={5}
              value={safePerson.comments}
              maxLength={1000}
              onChange={(e) =>
                update("comments", e.target.value.replace(/[\r\n]/g, ""))
              }
              placeholder="Enter comments"
              className={`${inputClass} resize-none`}
            />
            <div className="mt-2 text-xs text-slate-400">
              {1000 - safePerson.comments.length} characters remaining
            </div>
          </section>
        )}
      </div>
    </div>
  );
}