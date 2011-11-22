<?php
/**
* A class to read in a triangulated Obj file and write it out to JSon
* Version 1.0
* 
* Pete Smith, Bournemouth University
*
* TODO: Read and write QUAD objs 
*/
class ObjLoader
{

        //these are used for the unpacking of raw OBJ data
        private $m_verts = array();
        private $m_texCoords = array();
        private $m_norms = array();
        private $m_indices = array();
        
        //use to hold the data in a form that can easily be pushed to GL buffers
        private $m_unpackedVerts = array();
        private $m_unpackedTexCoords = array();
        private $m_unpackedNorms = array();
        
        //used for bounding volume calculations and centre point
        private $m_minX = 0.0;
        private $m_minY = 0.0;
        private $m_minZ = 0.0;
        private $m_maxX = 0.0;
        private $m_maxY = 0.0;
        private $m_maxZ = 0.0;
        
        private $firstLoop = true;
        
        public function __construct($filepath = null)
        {               
                if($filepath)
                {
                        $this->load($filepath);
                }
        }
        
        public function load($filepath)
        {               
                // open obj file                
                $fp = fopen($filepath, "r+");
                
                if(!$fp)
                {
                        echo "Error! Couldn't open the file: ".$filepath;
                }
                else
                {
                        // read each line
                        while(!feof($fp))
                        {
                                $this->readObjLine(fgets($fp, 1024));
                        }
                        //close file                                    
                        fclose($fp);
                }
        }
        
        private function readObjLine($line)
        {
                if($line[0] == "v")
                {
                        //its a texcoord
                        if($line[1] == "t")
                        {
                                $elements = explode(" ",$line);
                                for ($i=0; $i < count($elements); $i++) { 
                                        trim($elements[$i]);
                                }
                                $this->m_texCoords[] = array($elements[1], $elements[2]);
                        }
                        //its a normal
                        else if($line[1] == "n")
                        {
                                $elements = explode(" ",$line);
                                for ($i=0; $i < count($elements); $i++) { 
                                        trim($elements[$i]);
                                }
                                $this->m_norms[] = array($elements[1], $elements[2], $elements[3]);
                        }
                        //its a vertex
                        else
                        {
                                $elements = explode(" ",$line);
                                for ($i=0; $i < count($elements); $i++) { 
                                        trim($elements[$i]);
                                }
                                $this->m_verts[] = array($elements[1], $elements[2], $elements[3]);
                                
                                //setup Bbox values
                                if($this->firstLoop)
                                {
                                        $this->m_minX = $elements[1];
                                        $this->m_minY = $elements[2];
                                        $this->m_minZ = $elements[3];
                                        
                                        $this->m_maxX = $elements[1];
                                        $this->m_maxY = $elements[2];
                                        $this->m_maxZ = $elements[3];
                                        
                                        $this->firstLoop = false;
                                }
                                else
                                {
                                        //X
                                        if($elements[1] < $this->m_minX)
                                                $this->m_minX = $elements[1];
                                        if($elements[1] > $this->m_maxX)
                                                $this->m_maxX = $elements[1];
                                        //Y     
                                        if($elements[2] < $this->m_minY)
                                                $this->m_minY = $elements[2];
                                        if($elements[2] > $this->m_maxY)
                                                $this->m_maxY = $elements[2];
                                        //Z     
                                        if($elements[3] < $this->m_minZ)
                                                $this->m_minZ = $elements[3];
                                        if($elements[3] > $this->m_maxZ)
                                                $this->m_maxZ = $elements[3];
                                }
                        }
                }
                else if($line[0] == "f")
                {
                        $elements = explode(" ",$line);
                        for ($i=0; $i < count($elements); $i++) { 
                                trim($elements[$i]);
                        }
                        for ($i=1; $i < 4; $i++) { 
                                $faceData = explode("/",$elements[$i]);
                                $this->m_indices[] = $faceData;
                        }
                }
        }
        
        public function unpackForGL()
        {               
                for ($i=0; $i < count($this->m_indices); $i++) { 
                        $vertex = $this->m_indices[$i][0];
                        $tex = $this->m_indices[$i][1];
                        $norm = $this->m_indices[$i][2];
                                                
                        $this->m_unpackedVerts[] = $this->m_verts[$vertex-1];
                        $this->m_unpackedTexCoords[] = $this->m_texCoords[$tex-1];
                        $this->m_unpackedNorms[] = $this->m_norms[$norm-1];
                }
        }
                
        public function writeUnpackedToJson($filepath)
        {
                $fp = fopen($filepath, 'w');
                        
                if(!$fp)
                {
                        echo "Could not open JS file: ".$filepath;
                }
                else
                {                       
                        //write our main data for the buffers
                        $this->writeJsonChunk($fp, $this->m_unpackedVerts, "vertices");
                        $this->writeJsonChunk($fp, $this->m_unpackedTexCoords, "textureCoords");
                        $this->writeJsonChunk($fp, $this->m_unpackedNorms, "normals");
                        //
                        
                        //average the min and max vectors to find the centre
                        $centreX = ($this->m_minX + $this->m_maxX) / 2;
                        $centreY = ($this->m_minY + $this->m_maxY) / 2;
                        $centreZ = ($this->m_minZ + $this->m_maxZ) / 2;
                        //
                        
                        //find the biggest length extent and setup the radius 
                        $diameter = $this->m_maxX - $this->m_minX;
                        
                        if($this->m_maxY - $this->m_minY > $diameter)
                                $diameter = $this->m_maxY - $this->m_minY;
                        
                        if($this->m_maxZ - $this->m_minZ > $diameter)
                                $diameter = $this->m_maxZ - $this->m_minZ;                      
                                
                        $radius = $diameter * 0.5;
                        //
                        
                        //write our extra data                  
                        fwrite($fp, 'var vertCount = '.count($this->m_unpackedVerts).";\n");
                        fwrite($fp, 'var centre = [ '.round($centreX,6).', '.round($centreY,6).', '.round($centreZ, 6).'];'."\n");
                        fwrite($fp, 'var min = ['.$this->m_minX.', '.$this->m_minY.', '.trim($this->m_minZ).'];'."\n");
                        fwrite($fp, 'var max = ['.$this->m_maxX.', '.$this->m_maxY.', '.trim($this->m_maxZ).'];'."\n");
                        fwrite($fp, 'var radius = '.$radius.";\n");
                        //
                        
                        fclose($fp);
                }
        }
        
        private function writeJsonChunk($fp, $data, $varString)
        {
                fwrite($fp, 'var '.$varString.' = ['."\n");
                for ($i=0; $i < count($data); $i++) { 
                        fwrite($fp, "\t");      
                        
                        for ($j=0; $j < count($data[$i]); $j++)
                        {
                                if($j != count($data[$i]) - 1)
                                {
                                        fwrite($fp, $data[$i][$j].',');
                                }
                                else if($j == count($data[$i]) - 1 && $i ==  count($data) - 1)
                                {
                                        fwrite($fp, $data[$i][$j]);
                                }
                                else
                                {
                                        $trimmedData = trim($data[$i][$j]);
                                        fwrite($fp, $trimmedData.",\n");
                                }
                        }
                }
                fwrite($fp, '];'."\n\n");
                
        }
        
        public function flush()
        {
                $m_verts = array();
                $m_texCoords = array();
                $m_norms = array();
                $m_indices = array();

                $m_unpackedVerts = array();
                $m_unpackedTexCoords = array();
                $m_unpackedNorms = array();
                
                $m_minX = 0.0;
                $m_minY = 0.0;
                $m_minZ = 0.0;
                $m_maxX = 0.0;
                $m_maxY = 0.0;
                $m_maxZ = 0.0;
                $m_vertSum = array();
        }
}


?>