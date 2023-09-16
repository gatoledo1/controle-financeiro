const DataPrint = () => {
  return (
    <div className="container print">
      <a
        className="btn"
        style={{
          backgroundColor: 'rgba(0,138,255, 0.1)',
          color: '#3399ff',
          marginTop: '50px',
        }}
        onClick={() => window && window.print()}
      >
        Gerar PDF
      </a>
    </div>
  )
}

export default DataPrint