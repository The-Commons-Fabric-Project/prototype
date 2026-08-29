/**
 * Moving the "password" and "email" modes from the Claude artifact's LoginModal to a separate component, not currently a feature.
 */

import { useState } from "react";

type FormMode = "password" | "email";

export default function ChangeCredsModal({
  ...props
}) {
  const [mode, setMode] = useState<FormMode>("password");
  
  /** @state user specified value to update new email or new password */
  const [newVal, setNewVal] = useState("");

  // user is changing either password or username
  const isPw = mode === "password";
  // onChangeMode({title: (isPw? "Change password" : "Change email"), subtitle: (isPw ? undefined : "We'll send a confirmation link to the new address.")});
  return (
    <form onSubmit={handleSubmit} className="py-2 px-6">
      <Field label={isPw ? "New password" : "New email"}>
        <input 
          type={isPw ? "password" : "text"} 
          className={`${baseInputStyles} ${inputStyle(false)}`}
          value={newVal}
          onChange={(e) => setNewVal(e.target.value)} placeholder={isPw ? "At least 6 characters" : "you@org.example"} />
      </Field>
      <div className="flex gap-2.5">
        <Button variant="ghost" className="flex-1"
        onClick={() => { 
          setMode("login"); 
          setNewVal(""); 
          onChangeMode({ title: "Log in", subtitle: undefined});
        }} label="Back"/>
        <Button className="flex-1" type="submit"
          onClick={() => {
          toast(isPw ? "Password updated." : "Confirmation email sent.");
          setMode("login"); setNewVal("");
          onChangeMode({ title: "Log in", subtitle: undefined});
        }} label="Save"/>
      </div>
    </form>
  )

  // <div className="flex justify-center gap-4.5 mt-4">
  //       <Button onClick={() => {
  //         setMode("password");
  //         onChangeMode({title: "Change password", subtitle: undefined});
  //       }} 
  //       variant="link" label="Change password"/>
  //       <Button onClick={() => {
  //         setMode("email");
  //         onChangeMode({title: "Change email", subtitle: "We'll send a confirmation link to the new address."});
  //       }} 
  //       variant="link" label="Change email"/>
  //     </div>
}
