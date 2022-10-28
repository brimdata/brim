import React, {useState} from "react"

import {FileField} from "../../brim/form"
import FileInput from "../common/forms/FileInput"
import InputLabel from "../common/forms/InputLabel"

type Props = {
  config: FileField
}

export default function SuricataRunner({config}: Props) {
  const {name, label, defaultValue} = config
  const [showFeedback, setShowFeedback] = useState(false)

  function onChange(val) {
    setShowFeedback(val !== defaultValue)
  }

  return (
    <div className="setting-panel">
      <InputLabel>{label}</InputLabel>
      <FileInput
        name={name}
        defaultValue={defaultValue}
        onChange={onChange}
        placeholder="default"
      />
      {showFeedback ? <p className="feedback">Restart required.</p> : null}
    </div>
  )
}
