type Props = {
  nameInput?: any
  keyInput?: any
}

export function PoolForm(props: Props) {
  return (
    <>
      <label htmlFor="name">Pool Name</label>
      <input
        type="text"
        name="name"
        id="name"
        placeholder="my_pool"
        {...props.nameInput}
      />

      <label htmlFor="key">Pool Key</label>
      <input
        id="key"
        name="key"
        type="text"
        placeholder="id, ts, primary_key "
        {...props.keyInput}
      />

      <label>Sort Order</label>
      <div className="cluster gap-s">
        <label htmlFor="ascending">
          <input id="ascending" name="order" type="radio" value="asc" />
          Ascending
        </label>
        <div>
          <label htmlFor="descending">
            <input
              id="descending"
              name="order"
              type="radio"
              value="desc"
              defaultChecked
            />
            Descending
          </label>
        </div>
      </div>
    </>
  )
}
